'use client';

import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * A component that displays text with a typing effect.
 * @param {object} props - The component's props.
 * @param {string|string[]} props.text - The text to display.
 * @param {React.ElementType} props.as - The component to render as.
 * @param {number} props.typingSpeed - The speed of the typing animation.
 * @param {number} props.initialDelay - The initial delay before the animation starts.
 * @param {number} props.pauseDuration - The duration to pause between sentences.
 * @param {number} props.deletingSpeed - The speed of the deleting animation.
 * @param {boolean} props.loop - Whether to loop the animation.
 * @param {string} props.className - The CSS class to apply to the component.
 * @param {boolean} props.showCursor - Whether to show a cursor.
 * @param {boolean} props.hideCursorWhileTyping - Whether to hide the cursor while typing.
 * @param {string} props.cursorCharacter - The character to use for the cursor.
 * @param {string} props.cursorClassName - The CSS class to apply to the cursor.
 * @param {number} props.cursorBlinkDuration - The duration of the cursor blink.
 * @param {string[]} props.textColors - The colors to use for the text.
 * @param {{min: number, max: number}} props.variableSpeed - The variable speed of the typing animation.
 * @param {function} props.onSentenceComplete - The function to call when a sentence is complete.
 * @param {boolean} props.startOnVisible - Whether to start the animation when the component is visible.
 * @param {boolean} props.reverseMode - Whether to reverse the animation.
 * @returns {JSX.Element} The rendered component.
 */
const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return '#ffffff';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return;

    let timeout;

    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return;
          }

          if (onSentenceComplete) {
            onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          }

          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev + processedText[currentCharIndex]);
            setCurrentCharIndex(prev => prev + 1);
          }, variableSpeed ? getRandomSpeed() : typingSpeed);
        } else if (textArray.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  return createElement(Component, {
    ref: containerRef,
    className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,
    ...props
  }, <span className="inline" style={{ color: getCurrentTextColor() }}>
    {displayedText}
  </span>, showCursor && (
    <span
      ref={cursorRef}
      className={`ml-1 inline-block opacity-100 ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}>
      {cursorCharacter}
    </span>
  ));
};

export default TextType;
