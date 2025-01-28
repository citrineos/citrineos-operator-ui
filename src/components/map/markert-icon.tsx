export interface MarkerIconProps {
  style?: React.CSSProperties; // Define the type for the style prop
  fillColor?: string; // Optional prop for the fill color
}

export const MarkerIcon = ({
  style,
  fillColor = 'currentColor',
}: MarkerIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="256"
      height="256"
      viewBox="0 0 256 256"
      style={style} // Apply the passed style here
    >
      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
        <path
          d="M 45 84.383 c -0.293 0 -0.572 -0.129 -0.762 -0.353 L 19.55 54.955 c -5.114 -6.029 -7.931 -13.69 -7.931 -21.574 C 11.619 14.975 26.594 0 45 0 C 53.917 0 62.3 3.472 68.604 9.777 c 6.305 6.305 9.777 14.688 9.776 23.604 c 0 7.884 -2.816 15.545 -7.931 21.573 L 45.763 84.03 C 45.573 84.254 45.294 84.383 45 84.383 z"
          fill={fillColor}
          strokeWidth="1"
          fillRule="evenodd"
        />
        <path
          d="M 36 46.15 c -0.263 0 -0.523 -0.104 -0.717 -0.303 c -0.341 -0.351 -0.378 -0.896 -0.089 -1.289 l 6.512 -8.867 l -4.248 -2.703 c -0.277 -0.176 -0.45 -0.478 -0.463 -0.806 c -0.012 -0.328 0.138 -0.642 0.401 -0.838 l 16.006 -11.969 c 0.381 -0.285 0.911 -0.262 1.265 0.055 c 0.355 0.317 0.438 0.84 0.197 1.251 l -5.256 8.974 l 4.675 2.246 c 0.32 0.154 0.535 0.468 0.563 0.823 c 0.027 0.355 -0.135 0.698 -0.428 0.901 L 36.569 45.973 C 36.396 46.092 36.198 46.15 36 46.15 z"
          fill="white"
        />
      </g>
    </svg>
  );
};
