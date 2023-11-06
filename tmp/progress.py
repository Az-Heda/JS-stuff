from tqdm import tqdm
import time
from datetime import timedelta
from sys import getsizeof as gso
import requests

class bcolors:
	FLASING = '\033[5m'
	HEADER = '\033[95m'
	OKBLUE = '\033[94m'
	OKCYAN = '\033[96m'
	OKGREEN = '\033[92m'
	WARNING = '\033[93m'
	FAIL = '\033[91m'
	ENDC = '\033[0m'
	BOLD = '\033[1m'
	UNDERLINE = '\033[4m'

def progressbar(iter):
	def getAVG(l):
		somma = 0
		for x in l:
			somma += x
		# print('')
		# print(l)
		# print('')
		return somma / len(l)
	
	chars = [ ' ', chr(0x258F), chr(0x258E), chr(0x258D), chr(0x258C), chr(0x258B), chr(0x258A), chr(0x2589), chr(0x2588) ]
	cols = 75
	print('\033[?25l', end="")
	start = time.time()
	lastTime = time.time()
	memory = []
	now = time.time()
	avgTime = 0
	try:
		for p in range(len(iter)):
			partialTime1 = time.time()
			v = iter[p]
			partialTime2 = time.time()
			diff = partialTime2 - partialTime1
			perc = (p+1) * cols / len(iter)
			currentIndex = list(map(lambda y: y < perc, [ (cols / len(chars)-2 * x) for x in range(len(chars)-1) ]))
			if False in currentIndex:
				currentIndex = currentIndex.index(False)
			else: 
				currentIndex = 0
			if currentIndex < 0:
				currentIndex = 0
			bar = ''.join([ chars[
				(len(chars)-1) if int(perc) > p else 
				(currentIndex) if int(perc) < perc else 0
			] for p in range(cols) ])

				

			timePassed = (time.time() - start)
			timePassed = str(timedelta(seconds=timePassed))
			estime = 0
			if p > 0:
				percStep = ((p+1) * cols / len(iter)) - ((p) * cols / len(iter))
				timeSpent = time.time() - start
				missingSteps = len(iter) - p
				now = time.time()
				estime = missingSteps * (now - lastTime)

				with open('tmp/test.tsv', 'a') as file:
					file.write(f'{timeSpent:.7f}\t{missingSteps}\t{estime:.7f}\n')
			estimatedTime = str(timedelta(seconds=estime))

			bar = bcolors.OKGREEN + bar + bcolors.ENDC
			before = f'{((p+1) * 100 / len(iter)):.3f}%' if int(((p+1) * 100 / len(iter))) < 100 else '100%'.ljust(7)
			after = f'  <{timePassed[:-3]}> [Estimated: {estimatedTime[:-3]}]'.ljust(65)
			
			print(before, bar, after, end='\r')
			yield v
			lastTime = now
	except KeyboardInterrupt:
		...
	finally:
		af = after.split('[')
		af[1] = ' '*len(af[1])
		print(before, bar, ''.join(af))
		print('\033[?25h', end="")
	print()


letters = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(' ') * 15

with open('tmp/file.txt', 'w') as file:
	for item in progressbar(letters):
		file.write(str(item)+'\n')
		time.sleep(.05)