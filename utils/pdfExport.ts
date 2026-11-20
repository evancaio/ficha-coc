import { Character } from '@/types/character';

export interface FormattedCombatLine {
    name: string;
    detail: string;
}

export interface FormattedBackstoryItem {
    label: string;
    value: string;
}

export function getSkillTotal(character: Character, skillName: string): number {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const canonicalCandidates: string[] = [];
    const lower = skillName.toLowerCase();

    if (lower.includes('armas de fogo')) {
        if (lower.includes('pistola') || lower.includes('pistolas') || lower.includes('pst')) {
            canonicalCandidates.push('Armas de Fogo (Pistolas)');
        }
        if (lower.includes('rifle') || lower.includes('espingarda') || lower.includes('arco') || lower.includes('arcos') || lower.includes('rifles')) {
            canonicalCandidates.push('Armas de Fogo (Rifles/Espingardas)');
        }
        if (lower.includes('submetral') || lower.includes('smt')) {
            canonicalCandidates.push('Armas de Fogo (Submetralhadoras)');
        }
        if (lower.includes('metralh') || lower.includes('mt')) {
            canonicalCandidates.push('Armas de Fogo (Metralhadoras)');
        }
    }

    const exact = character.skills.find(s => s.name === skillName);
    if (exact) {
        return (typeof exact.baseValue === 'number' ? exact.baseValue : 0) + exact.occupationPoints + exact.personalPoints + (exact.archetypePoints || 0);
    }

    for (const cand of canonicalCandidates) {
        const found = character.skills.find(s => s.name === cand);
        if (found) {
            return (typeof found.baseValue === 'number' ? found.baseValue : 0) + found.occupationPoints + found.personalPoints + (found.archetypePoints || 0);
        }
    }

    const targetNorm = normalize(skillName);
    const fuzzy = character.skills.find(
        s => normalize(s.name).includes(targetNorm) || targetNorm.includes(normalize(s.name))
    );
    if (fuzzy) {
        return (typeof fuzzy.baseValue === 'number' ? fuzzy.baseValue : 0) + fuzzy.occupationPoints + fuzzy.personalPoints + (fuzzy.archetypePoints || 0);
    }

    return 0;
}

export function formatHeaderTitle(character: Character): string {
    const parts: string[] = [];
    const isPulp = character.gameMode === 'pulp';
    const name = character.basicInfo.name?.trim() || (isPulp ? 'HERÓI PULP SEM NOME' : 'INVESTIGADOR SEM NOME');
    parts.push(name);

    if (isPulp && character.archetype?.trim()) {
        parts.push(`[${character.archetype.trim()}]`);
    }

    if (character.basicInfo.occupation?.trim()) {
        parts.push(character.basicInfo.occupation.trim());
    }
    if (character.basicInfo.age) {
        parts.push(`${character.basicInfo.age} ANOS`);
    }
    return parts.join(', ').toUpperCase();
}

export function formatPortraitCaption(character: Character): string {
    const fullName = character.basicInfo.name?.trim();
    if (!fullName) return 'INVESTIGADOR';
    const words = fullName.split(/\s+/);
    return words[words.length - 1].toUpperCase();
}

export function formatLuckValue(character: Character): number {
    if (character.derivedStats.LUCK && character.derivedStats.LUCK > 0) {
        return character.derivedStats.LUCK;
    }
    // Caso LUCK não tenha sido rolado separadamente, usa POD ou moedas * 10 como referência
    return character.characteristics.POW || 50;
}

export function formatCombatLines(character: Character): FormattedCombatLine[] {
    const lines: FormattedCombatLine[] = [];

    const brawlTotal = getSkillTotal(character, 'Lutar (Briga)');
    const brawlHalf = Math.floor(brawlTotal / 2);
    const brawlFifth = Math.floor(brawlTotal / 5);
    lines.push({
        name: 'Briga',
        detail: `${brawlTotal}% (${brawlHalf}/${brawlFifth}), 1D3+DX de dano`
    });

    const dodgeTotal = getSkillTotal(character, 'Esquivar');
    const dodgeHalf = Math.floor(dodgeTotal / 2);
    const dodgeFifth = Math.floor(dodgeTotal / 5);
    lines.push({
        name: 'Esquivar',
        detail: `${dodgeTotal}% (${dodgeHalf}/${dodgeFifth})`
    });

    for (const weapon of character.weapons) {
        if (weapon.name === 'Desarmado') continue;
        const skillTotal = getSkillTotal(character, weapon.skill);
        const half = Math.floor(skillTotal / 2);
        const fifth = Math.floor(skillTotal / 5);

        const rawDamage = (weapon.damage || '')
            .replace(/\{db\}/gi, 'DX')
            .replace(/\bdb\b/gi, 'DX')
            .replace(/\s*\+\s*0\b/g, '')
            .replace(/\s+/g, '')
            .toUpperCase();

        const damageText = rawDamage ? `${rawDamage} de dano` : '';

        let rangeText = '';
        if (weapon.range && weapon.range !== '-') {
            const r = weapon.range.trim();
            if (/^toque$/i.test(r)) {
                rangeText = 'alcance de toque';
            } else if (/^\d+\s*m$/i.test(r)) {
                rangeText = `${r.replace(/m$/i, '').trim()} metros de alcance`;
            } else {
                rangeText = `alcance ${r}`;
            }
        }

        let attacksText = '';
        if (weapon.attacks && String(weapon.attacks) !== '-') {
            const a = String(weapon.attacks).trim();
            attacksText = a === '1' ? '1 ataque por rodada' : `${a} ataques por rodada`;
        }

        let ammoText = '';
        if (weapon.ammo && String(weapon.ammo) !== '-' && String(weapon.ammo).trim() !== '') {
            const am = String(weapon.ammo).trim();
            ammoText = /^\d+$/.test(am) ? `${am} tiros` : `munição ${am}`;
        }

        let malfText = '';
        if (weapon.malfunction && weapon.malfunction !== '-' && weapon.malfunction.trim() !== '') {
            const m = weapon.malfunction.trim() === '100' ? '00' : weapon.malfunction.trim();
            malfText = `defeito ${m}`;
        }

        const specs = [damageText, rangeText, attacksText, ammoText, malfText].filter(Boolean).join(', ');
        lines.push({
            name: weapon.name,
            detail: `${skillTotal}% (${half}/${fifth})${specs ? `, ${specs}` : ''}`
        });
    }

    return lines;
}

export function formatSkillsAbove20(character: Character): string {
    const filtered = character.skills
        .map(skill => {
            const total = (typeof skill.baseValue === 'number' ? skill.baseValue : 0) + skill.occupationPoints + skill.personalPoints + (skill.archetypePoints || 0);
            let displayName = skill.name;
            if (skill.specialization && skill.specialization.trim()) {
                if (displayName.includes('(Outra)')) {
                    displayName = displayName.replace('(Outra)', `(${skill.specialization.trim()})`);
                } else {
                    displayName = `${displayName} (${skill.specialization.trim()})`;
                }
            }
            return {
                rawName: skill.name,
                displayName,
                total
            };
        })
        .filter(s => s.total > 20 && s.rawName !== 'Lutar (Briga)' && s.rawName !== 'Esquivar')
        .sort((a, b) => a.displayName.localeCompare(b.displayName, 'pt-BR'));

    if (filtered.length === 0) {
        return 'Nenhuma perícia acima de 20%.';
    }

    return filtered.map(s => `${s.displayName} ${s.total}%`).join(', ') + '.';
}

export function formatBackstoryItems(character: Character): FormattedBackstoryItem[] {
    const items: FormattedBackstoryItem[] = [];
    const b = character.backstory;

    if (character.gameMode === 'pulp') {
        if (character.archetype?.trim()) {
            items.push({ label: 'Arquétipo Pulp', value: character.archetype.trim() });
        }
        if (character.pulpTalents && character.pulpTalents.length > 0) {
            items.push({ label: 'Talentos Pulp', value: character.pulpTalents.join(', ') });
        }
    }

    if (b.personalDescription?.trim()) {
        items.push({ label: 'Descrição', value: b.personalDescription.trim() });
    }
    if (b.ideology?.trim()) {
        items.push({ label: 'Ideologia/Crenças', value: b.ideology.trim() });
    }
    if (b.significantPeople?.trim()) {
        items.push({ label: 'Pessoas Significativas', value: b.significantPeople.trim() });
    }
    if (b.meaningfulLocations?.trim()) {
        items.push({ label: 'Locais Importantes', value: b.meaningfulLocations.trim() });
    }
    if (b.treasuredPossessions?.trim()) {
        items.push({ label: 'Pertences Queridos', value: b.treasuredPossessions.trim() });
    }
    if (b.traits?.trim()) {
        items.push({ label: 'Características', value: b.traits.trim() });
    }
    if (b.equipment?.trim()) {
        items.push({ label: 'Equipamento', value: b.equipment.trim() });
    }
    const wounds = character.status?.woundsAndScars?.trim() || b.injuriesScars?.trim();
    if (wounds) {
        items.push({ label: 'Ferimentos e Cicatrizes', value: wounds });
    }
    const phobias = character.status?.maniasAndPhobias?.trim() || b.phobiasManias?.trim();
    if (phobias) {
        items.push({ label: 'Manias e Fobias', value: phobias });
    }
    if (character.status?.strangeEncounters?.trim()) {
        items.push({ label: 'Encontros Estranhos', value: character.status.strangeEncounters.trim() });
    }

    return items;
}

export function formatNarrativeParagraphs(character: Character): string[] {
    const raw = character.backstory.narrative?.trim();
    if (!raw) return [];
    return raw.split(/\n+/).map(p => p.trim()).filter(Boolean);
}

/**
 * Empacota um DataURL JPEG em um arquivo binário PDF A4 válido sem dependências externas
 */
function createPdfBlobFromJpegDataUrl(jpegDataUrl: string, imgWidth: number, imgHeight: number): Blob {
    const base64 = jpegDataUrl.split(',')[1];
    const binaryImg = atob(base64);
    const imgBytes = new Uint8Array(binaryImg.length);
    for (let i = 0; i < binaryImg.length; i++) {
        imgBytes[i] = binaryImg.charCodeAt(i);
    }

    // Tamanho A4 em pontos PostScript (72 dpi): 595.28 x 841.89
    const pageW = 595.28;
    const pageH = 841.89;

    const encoder = new TextEncoder();
    const chunks: BlobPart[] = [];
    const offsets: number[] = [];
    let currentLength = 0;

    const pushStr = (str: string) => {
        const bytes = encoder.encode(str);
        chunks.push(bytes as unknown as BlobPart);
        currentLength += bytes.length;
    };

    const pushBytes = (bytes: Uint8Array) => {
        chunks.push(bytes as unknown as BlobPart);
        currentLength += bytes.length;
    };

    const startObj = (id: number) => {
        offsets[id] = currentLength;
        pushStr(`${id} 0 obj\n`);
    };

    pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');

    // 1: Catalog
    startObj(1);
    pushStr('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    // 2: Pages
    startObj(2);
    pushStr('<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

    // 3: Page
    startObj(3);
    pushStr(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW.toFixed(2)} ${pageH.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`
    );

    // 4: Image XObject
    startObj(4);
    pushStr(
        `<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`
    );
    pushBytes(imgBytes);
    pushStr('\nendstream\nendobj\n');

    // 5: Page Content Stream
    const contentStream = `q\n${pageW.toFixed(2)} 0 0 ${pageH.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;
    const contentBytes = encoder.encode(contentStream);
    startObj(5);
    pushStr(`<< /Length ${contentBytes.length} >>\nstream\n`);
    pushBytes(contentBytes);
    pushStr('endstream\nendobj\n');

    // XRef
    const xrefOffset = currentLength;
    pushStr('xref\n0 6\n0000000000 65535 f \n');
    for (let i = 1; i <= 5; i++) {
        const off = String(offsets[i]).padStart(10, '0');
        pushStr(`${off} 00000 n \n`);
    }

    pushStr(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

    return new Blob(chunks, { type: 'application/pdf' });
}

function drawSteppedBorder(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, step: number) {
    const tracePath = (inset: number) => {
        const s = step;
        ctx.beginPath();
        // Top horizontal edge (inset from corners by s)
        ctx.moveTo(x + s + inset, y + inset);
        ctx.lineTo(x + w - s - inset, y + inset);
        // Top-right step down then right
        ctx.lineTo(x + w - s - inset, y + s + inset);
        ctx.lineTo(x + w - inset, y + s + inset);
        // Right vertical edge down to bottom-right
        ctx.lineTo(x + w - inset, y + h - inset);
        // Bottom horizontal edge to bottom-left
        ctx.lineTo(x + inset, y + h - inset);
        // Left vertical edge up to top-left step
        ctx.lineTo(x + inset, y + s + inset);
        ctx.lineTo(x + s + inset, y + s + inset);
        ctx.closePath();
    };

    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 4.5;
    tracePath(0);
    ctx.stroke();

    ctx.lineWidth = 1.6;
    tracePath(8);
    ctx.stroke();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (ctx.measureText(test).width <= maxWidth) {
            current = test;
        } else {
            if (current) lines.push(current);
            current = word;
        }
    }
    if (current) lines.push(current);
    return lines;
}

export async function downloadBookStylePdf(character: Character): Promise<void> {
    if (typeof document !== 'undefined' && (document as any).fonts?.ready) {
        await (document as any).fonts.ready;
    }

    const W = 1654; // A4 @ 200 DPI
    const H = 2339;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fundo branco limpo estilo página de livro
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Moldura dupla com cantos superiores chanfrados
    const marginX = 68;
    const marginY = 58;
    const frameW = W - marginX * 2;
    const frameH = H - marginY * 2;
    drawSteppedBorder(ctx, marginX, marginY, frameW, frameH, 34);

    const innerLeft = marginX + 46;
    const innerRight = W - marginX - 46;
    const innerWidth = innerRight - innerLeft;

    // 1. Título Principal Centralizado
    const title = formatHeaderTitle(character);
    ctx.fillStyle = '#111111';
    let titleFontSize = 40;
    ctx.font = `400 ${titleFontSize}px "Saira Stencil One", Impact, sans-serif`;
    while (ctx.measureText(title).width > innerWidth - 40 && titleFontSize > 24) {
        titleFontSize -= 2;
        ctx.font = `400 ${titleFontSize}px "Saira Stencil One", Impact, sans-serif`;
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const titleY = marginY + 34;
    ctx.fillText(title, W / 2, titleY);

    // Geometria do retrato à direita
    const contentTopY = titleY + titleFontSize + 28;
    const portraitW = 435;
    const portraitH = 540;
    const portraitX = innerRight - portraitW;
    const portraitY = contentTopY + 8;

    // Desenha a moldura dupla do retrato
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 4.5;
    ctx.strokeRect(portraitX, portraitY, portraitW, portraitH);
    ctx.lineWidth = 1.6;
    ctx.strokeRect(portraitX + 8, portraitY + 8, portraitW - 16, portraitH - 16);

    // Se houver foto, carrega e desenha em P&B / alto contraste
    if (character.basicInfo.photo) {
        await new Promise<void>(resolve => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                ctx.save();
                const ix = portraitX + 10;
                const iy = portraitY + 10;
                const iw = portraitW - 20;
                const ih = portraitH - 20;
                ctx.beginPath();
                ctx.rect(ix, iy, iw, ih);
                ctx.clip();

                const scale = Math.max(iw / img.width, ih / img.height);
                const dw = img.width * scale;
                const dh = img.height * scale;
                const dx = ix + (iw - dw) / 2;
                const dy = iy + (ih - dh) / 2;

                ctx.filter = 'grayscale(100%) contrast(115%)';
                ctx.drawImage(img, dx, dy, dw, dh);
                ctx.restore();
                resolve();
            };
            img.onerror = () => resolve();
            img.src = character.basicInfo.photo!;
        });
    } else {
        // Silhueta clássica discreta quando sem foto
        ctx.save();
        ctx.fillStyle = '#f3f3f3';
        ctx.fillRect(portraitX + 10, portraitY + 10, portraitW - 20, portraitH - 20);
        ctx.fillStyle = '#cccccc';
        ctx.beginPath();
        ctx.arc(portraitX + portraitW / 2, portraitY + portraitH * 0.36, 75, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(portraitX + portraitW / 2, portraitY + portraitH * 0.88, 155, Math.PI, 0, false);
        ctx.fill();
        ctx.restore();
    }

    // Sobrenome / legenda abaixo do retrato
    const caption = formatPortraitCaption(character);
    ctx.fillStyle = '#111111';
    ctx.font = '400 30px "Saira Stencil One", Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(caption, portraitX + portraitW / 2, portraitY + portraitH + 14);

    const portraitBottomClearY = portraitY + portraitH + 62;
    const leftColWidth = portraitX - innerLeft - 36;

    // 2. Bloco de Atributos (3 linhas à esquerda do retrato)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#111111';
    const bodyFont = '400 24px "PT Serif", Georgia, serif';
    ctx.font = bodyFont;

    const c = character.characteristics;
    const d = character.derivedStats;
    const luck = formatLuckValue(character);

    const colStep = Math.floor(leftColWidth / 5.1);
    let cursorY = contentTopY;

    const row1 = [
        `FOR ${c.STR}`,
        `CON ${c.CON}`,
        `TAM ${c.SIZ}`,
        `DES ${c.DEX}`,
        `INT ${c.INT}`
    ];
    row1.forEach((item, idx) => {
        ctx.fillText(item, innerLeft + idx * colStep, cursorY);
    });
    cursorY += 35;

    const row2 = [
        `APA ${c.APP}`,
        `POD ${c.POW}`,
        `EDU ${c.EDU}`,
        `SAN ${d.SAN}`,
        `PVs ${d.HP}`
    ];
    row2.forEach((item, idx) => {
        ctx.fillText(item, innerLeft + idx * colStep, cursorY);
    });
    cursorY += 35;

    const row3Text = `DX: ${d.damageBonus}     Corpo: ${d.build}     Movimento: ${d.movementRate}     Sorte: ${luck}     Pontos de Magia: ${d.MP}`;
    ctx.fillText(row3Text, innerLeft, cursorY);
    cursorY += 54;

    // 3. Bloco de Combate / Armas
    const combatLines = formatCombatLines(character);
    for (const line of combatLines) {
        const availW = cursorY < portraitBottomClearY ? leftColWidth : innerWidth;
        const fullLine = `${line.name}     ${line.detail}`;
        const wrapped = wrapLines(ctx, fullLine, availW);
        for (const wLine of wrapped) {
            ctx.fillText(wLine, innerLeft, cursorY);
            cursorY += 34;
        }
        cursorY += 4;
    }

    cursorY += 20;

    // 4. Bloco de Perícias (> 20%)
    const skillsText = `Perícias: ${formatSkillsAbove20(character)}`;
    const skillWords = skillsText.split(/\s+/);
    let currentLine = '';
    while (skillWords.length > 0) {
        const availW = cursorY < portraitBottomClearY ? leftColWidth : innerWidth;
        const word = skillWords[0];
        const test = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(test).width <= availW) {
            currentLine = test;
            skillWords.shift();
        } else {
            if (currentLine) {
                ctx.fillText(currentLine, innerLeft, cursorY);
                cursorY += 33;
                currentLine = '';
            } else {
                ctx.fillText(word, innerLeft, cursorY);
                cursorY += 33;
                skillWords.shift();
            }
        }
    }
    if (currentLine) {
        ctx.fillText(currentLine, innerLeft, cursorY);
        cursorY += 33;
    }

    cursorY += 24;

    // 5. Antecedentes
    const backstoryItems = formatBackstoryItems(character);
    if (backstoryItems.length > 0) {
        ctx.fillText('Antecedentes:', innerLeft, cursorY);
        cursorY += 36;

        const bulletIndent = 44;
        for (const item of backstoryItems) {
            const availW = cursorY < portraitBottomClearY ? leftColWidth : innerWidth;
            ctx.fillText('•', innerLeft, cursorY);
            const itemText = `${item.label}: ${item.value}`;
            const wrapped = wrapLines(ctx, itemText, availW - bulletIndent);
            for (const wLine of wrapped) {
                ctx.fillText(wLine, innerLeft + bulletIndent, cursorY);
                cursorY += 33;
            }
            cursorY += 4;
        }
    }

    // 6. Parágrafos de História / Background (se houver)
    const paragraphs = formatNarrativeParagraphs(character);
    if (paragraphs.length > 0) {
        if (cursorY < portraitBottomClearY) {
            cursorY = Math.max(cursorY + 14, portraitBottomClearY);
        } else {
            cursorY += 14;
        }

        for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
            const para = paragraphs[pIdx];
            const indent = pIdx === 0 ? 0 : 42;
            const words = para.split(/\s+/);
            let line = '';
            let isFirstLine = true;

            for (const word of words) {
                const maxW = isFirstLine ? innerWidth - indent : innerWidth;
                const test = line ? `${line} ${word}` : word;
                if (ctx.measureText(test).width <= maxW) {
                    line = test;
                } else {
                    ctx.fillText(line, innerLeft + (isFirstLine ? indent : 0), cursorY);
                    cursorY += 33;
                    isFirstLine = false;
                    line = word;
                }
            }
            if (line) {
                ctx.fillText(line, innerLeft + (isFirstLine ? indent : 0), cursorY);
                cursorY += 35;
            }
        }
    }

    // 7. Notas do Jogador
    cursorY += 18;
    if (cursorY < marginY + frameH - 80) {
        ctx.fillText('Notas do Jogador:', innerLeft, cursorY);
    }

    // Exporta para PDF e dispara o download
    const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);
    const pdfBlob = createPdfBlobFromJpegDataUrl(jpegUrl, W, H);
    const url = URL.createObjectURL(pdfBlob);

    const safeName = (character.basicInfo.name || 'investigador')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const link = document.createElement('a');
    link.href = url;
    link.download = `ficha-${safeName || 'investigador'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}
