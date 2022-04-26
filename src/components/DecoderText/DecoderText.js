import './DecoderText.css';

import { VisuallyHidden } from '../VisuallyHidden';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useSpring } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';
// import { prerender } from '../../utils/prerender';
import { classes } from '../../utils/style';
import { delay } from '../../utils/delay';

// prettier-ignore
const glyphs = [
    'ア', 'イ', 'ウ', 'エ', 'オ',
    'カ', 'キ', 'ク', 'ケ', 'コ',
    'サ', 'シ', 'ス', 'セ', 'ソ',
    'タ', 'チ', 'ツ', 'テ', 'ト',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
    'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'マ', 'ミ', 'ム', 'メ', 'モ',
    'ヤ', 'ユ', 'ヨ', 'ー',
    'ラ', 'リ', 'ル', 'レ', 'ロ',
    'ワ', 'ヰ', 'ヱ', 'ヲ', 'ン',
    'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
    'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
    'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
    'バ', 'ビ', 'ブ', 'ベ', 'ボ',
    'パ', 'ピ', 'プ', 'ペ', 'ポ',
  ];

// const tamilGlyph = [
//   'கி',
//   'ரு',
//   'பா',
//   'க',
//   'ர',
//   'பி',
//   'யூ',
//   'ழி',
//   'று',
//   'தீ',
//   'த',
//   'ழ',
//   'றி',
//   'ழு',
//   'ன',
//   'ரே',
//   'லூ',
//   'யே',
//   'து',
//   'டூ',
//   'வூ',
//   'ளு',
//   'றே',
//   'தெ',
//   'டை',
//   'கி',
//   'ரு',
//   'பா',
//   'க',
//   'ர',
//   'பி',
//   'யூ',
//   'ழி',
//   'று',
//   'தீ',
//   'த',
//   'ழ',
//   'றி',
//   'ழு',
//   'ன',
//   'ரே',
//   'லூ',
//   'யே',
//   'து',
//   'டூ',
//   'வூ',
//   'ளு',
//   'றே',
//   'தெ',
//   'டை',
//   'கி',
//   'ரு',
//   'பா',
//   'க',
//   'ர',
//   'பி',
//   'யூ',
//   'ழி',
//   'று',
//   'தீ',
//   'த',
//   'ழ',
//   'றி',
//   'ழு',
//   'ஶ்',
//   'ஜ்',
//   'லூ',
//   'யே',
//   'ஶ',
//   'டூ',
//   'வூ',
//   'ளு',
//   'ஶூ',
//   'தெ',
//   'டை',
// ];

const CharType = {
  Glyph: 'glyph',
  Value: 'value',
};

function shuffle(content, output, position) {
  return content.map((value, index) => {
    if (index < position) {
      return { type: CharType.Value, value };
    }

    if (position % 1 < 0.5) {
      const rand = Math.floor(Math.random() * glyphs.length);
      return { type: CharType.Glyph, value: glyphs[rand] };
    }

    return { type: CharType.Glyph, value: output[index].value };
  });
}

export const DecoderText = memo(
  ({ text, start = true, delay: startDelay = 0, className, ...rest }) => {
    const output = useRef([{ type: CharType.Glyph, value: '' }]);
    const container = useRef();
    const reduceMotion = usePrefersReducedMotion();
    const decoderSpring = useSpring(0, { stiffness: 8, damping: 5 });

    useEffect(() => {
      const containerInstance = container.current;
      const content = text.split('');
      let animation;

      const renderOutput = () => {
        const characterMap = output.current.map(item => {
          return `<span class="decoder-text__${item.type}">${item.value}</span>`;
        });

        containerInstance.innerHTML = characterMap.join('');
      };

      const unsubscribeSpring = decoderSpring.onChange(value => {
        output.current = shuffle(content, output.current, value);
        renderOutput();
      });

      const startSpring = async () => {
        await delay(startDelay);
        decoderSpring.set(content.length);
      };

      if (start && !animation && !reduceMotion) {
        startSpring();
      }

      if (reduceMotion) {
        output.current = content.map((value, index) => ({
          type: CharType.Value,
          value: content[index],
        }));
        renderOutput();
      }

      return () => {
        unsubscribeSpring?.();
      };
    }, [decoderSpring, reduceMotion, start, startDelay, text]);

    return (
      <span className={classes('decoder-text', className)} {...rest}>
        <VisuallyHidden className="decoder-text__label">{text}</VisuallyHidden>
        <span aria-hidden className="decoder-text__content" ref={container} />
      </span>
    );
  }
);
