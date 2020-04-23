import * as React from 'react';

function Path(props: {name?: string; fillColor?: string}): JSX.Element {
  let fill = props.fillColor || 'white';
  let nm = props.name || '';
  switch (nm) {
    case "up":
      return (
        <g>
          <path style={{ fill }} d="M49.998,0L27,36.498l46,0.004L49.998,0z" />
        </g>
      )
    case "down":
      return (
        <g>
          <path style={{ fill }} d="M50.004,100L73,63.502l-46-0.004L50.004,100z" />
        </g>
      )
    default:
      return (
        <g>
          <path style={{ fill }} d="M49.998,0L27,36.498l46,0.004L49.998,0z M50.004,100L73,63.502l-46-0.004L50.004,100z" />
        </g>
      )
  }
}

export const Flechas = ({
  name = "",
  style = {},
  fill = "white",
  viewBox = "0 0 100 100",
  width = "100%",
  className = "",
  height = "100%"
}) => {
  return (
    <svg
      width={width}
      style={style}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <Path name={name} fillColor={fill}/>
    </svg>
  );
}

