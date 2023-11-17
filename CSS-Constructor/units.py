ofile = './Client/_css/units.css'

classNames = [
	((0, 101), 'w{}p', 'width: {}%'),
	((0, 101), 'h{}p', 'height: {}%'),
	((0, 101), 'w{}v', 'width: {}vw'),
	((0, 101), 'h{}v', 'height: {}vh'),
	((0, 101), 'w{}vmin', 'width: {}vmin'),
	((0, 101), 'h{}vmin', 'height: {}vmin'),
	((0, 101), 'w{}vmax', 'width: {}vmax'),
	((0, 101), 'h{}vmax', 'height: {}vmax'),
	((0, 1921, 10), 'w{}px', 'width: {}px'),
	((0, 1921, 10), 'h{}px', 'height: {}px'),
]

with open(ofile, 'w') as file:
	for c in classNames:
		file.write('\n'.join([ f'.{c[1].format(x)} {"{"} {c[2].format(x)} {"}"}' for x in range(*c[0]) ]))
		file.write('\n\n')