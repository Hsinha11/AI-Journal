import './ShinyText.css';

/**
 * A component that displays shiny text.
 * @param {object} props - The component's props.
 * @param {string} props.text - The text to display.
 * @param {boolean} props.disabled - Whether the text is disabled.
 * @param {number} props.speed - The speed of the animation.
 * @param {string} props.className - The CSS class to apply to the component.
 * @returns {JSX.Element} The rendered component.
 */
const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{ animationDuration }}>
      {text}
    </div>
  );
};

export default ShinyText;
