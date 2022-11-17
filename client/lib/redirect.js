export default function redirect(props) {
  const url = new URL(window.location);
  if (props.to === '') {
    url.hash = '#';
  } else {
    url.hash = '#' + props.to;
  }
  window.location.replace(url);
  return null;
}
