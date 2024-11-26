import Entity from './entity'

export default class Codex extends Entity {
	pages: CodexPage[] = []
}

export class CodexPage {
	title: string = ''
}

export class BestiaryCodexPage extends CodexPage {
	npcName: string = ''
	description: string = ''
	quote: string = ''
	author: string = ''
	incarnation = false
	elite = false
	twoColumns = false
}
