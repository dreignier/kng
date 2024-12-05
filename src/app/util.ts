import { Converter, ShowdownExtension } from 'showdown'

export function arrayUp<T>(array: T[], element: T, minIndex?: number) {
  const index = array.indexOf(element);

  if (index > 0) {
		if (minIndex !== undefined && (index - 1) <= minIndex) {
			return
		}

    [array[index], array[index - 1]] = [array[index - 1], array[index]];
  }
}

export function arrayDown<T>(array: T[], element: T, maxIndex?: number) {
  const index = array.indexOf(element);

  if (index >= 0 && index < array.length - 1) {
		if (maxIndex !== undefined && (index + 1) >= maxIndex) {
			return
		}

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

export function showdownConverter(...showdownExtensions: ShowdownExtension[]) {
	const extensions: ShowdownExtension[] = showdownExtensions.concat([{
		type: 'lang',
		regex: />>([^<\n]+)<</g,
		replace: '<center>$1</center>'
	}, {
		type: 'lang',
		regex: />>([^<>\n]+)>>/g,
		replace: '<div class="text-right">$1</center>'
	}, {
		type: 'lang',
		regex: /@@([^@\n]+)@@/g,
		replace: '<span class="link">$1</span>'
	}, {
		type: 'lang',
		regex: /~~([^~\n]+)~~/g,
		replace: '<del>$1</del>'
	}, {
		type: 'lang',
		regex: /\^\^([^\^\n]+)\^\^/g,
		replace: '<sup>$1</sup>'
	}, {
		type: 'lang',
		regex: /__([^_\n]+)__/g,
		replace: '<ins>$1</ins>'
	}, {
		type: 'lang',
		regex: /=(=+)([^=\n]+)(=+)=/g,
		replace: (match: string, p1: string, p2: string) => `<big class="colorized bigger-${p1.length}">${p2}</big>`
	}, {
		type: 'lang',
		regex: /!(!+)([^!\n]+)(!+)!/g,
		replace: (match: string, p1: string, p2: string) => `<big class="bigger-${p1.length}">${p2}</big>`
	}])

	return new Converter({ extensions })
}
