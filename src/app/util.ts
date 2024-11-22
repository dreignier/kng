import { Converter, ShowdownExtension } from 'showdown'

export function arrayUp<T>(array: T[], element: T) {
  const index = array.indexOf(element);

  if (index > 0) {
    [array[index], array[index - 1]] = [array[index - 1], array[index]];
  }
}

export function arrayDown<T>(array: T[], element: T) {
  const index = array.indexOf(element);

  if (index >= 0 && index < array.length - 1) {
    [array[index], array[index + 1]] = [array[index + 1], array[index]];
  }
}

export function shuffle(a: any[]) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

export function fixColor(color: string) {
	if (color.charAt(0) === '#' && color.length === 7) {
		return color
	}

	if (color.charAt(0) === '#' && color.length === 9) {
		return color.slice(0, 7)
	}

	return '#00ffcc'
}

export function showdownConverter() {
	const showdownExtensions: ShowdownExtension[] = [{
		type: 'lang',
		regex: />>([^<]+)<</g,
		replace: '<center>$1</center>'
	}, {
		type: 'lang',
		regex: /@@([^@]+)@@/g,
		replace: '<span class="link">$1</span>'
	}, {
		type: 'lang',
		regex: /~~([^~]+)~~/g,
		replace: '<del>$1</del>'
	}, {
		type: 'lang',
		regex: /\^\^([^\^]+)\^\^/g,
		replace: '<sup>$1</sup>'
	}, {
		type: 'lang',
		regex: /__([^_]+)__/g,
		replace: '<ins>$1</ins>'
	}, {
		type: 'lang',
		regex: /====([^=]+)====/g,
		replace: '<big class="biggest">$1</big>'
	}, {
		type: 'lang',
		regex: /===([^=]+)===/g,
		replace: '<big class="bigger">$1</big>'
	}, {
		type: 'lang',
		regex: /==([^=]+)==/g,
		replace: '<big>$1</big>'
	}]

	return new Converter({ extensions: showdownExtensions })
}
