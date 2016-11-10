import threading
import webbrowser
from wsgiref.simple_server import make_server
from cgi import parse_qs
from anomaly_model import *
import time
FILE = 'index.html'
PORT = 8080

def application(environ, start_response):
	path = environ.get('PATH_INFO', '').lstrip('/')      #get path
	if ("static" in path or "data" in path):                               #handle query for
		status = '200 OK'                                #files in /static
		if(".js" in path):
			headers = [('Content-type', 'text/javascript')]
		elif(".css" in path):
			headers = [('Content-type', 'text/css')]        
		else:
			headers = [('Content-type', 'text/csv')]        
		start_response(status, headers)
		f2serv=open(path,'r')                            #read file 
		return environ['wsgi.file_wrapper'](f2serv)         #return file

	if environ['REQUEST_METHOD'] == 'POST':              #If POST...
		
		try:
			request_body_size = int(environ['CONTENT_LENGTH'])
			request_body = environ['wsgi.input'].read(request_body_size)
		except (TypeError, ValueError):
			request_body = "0"
		parsed_body = parse_qs(request_body)   
		print(parsed_body)		
		response_body = ""        
		for key in parsed_body.keys():
			value = parsed_body.get(key, ['']) #Returns the first value        
			value = map(float, value)
			if("point" in key):
				result = anomaly(value)#anomaly point
			elif("trend" in key):
				result = calc_trend(value)[0]#anomaly trend
			else:
				result = calc_trend(value)[1]#seasonal
			
			if(response_body == ""):		
				response_body = response_body + key + ":" 
			else:
				response_body = response_body + "-" + key + ":" #2 key			      	
			for i in result:
				response_body = response_body + str(i) + ","
		print(response_body)
		status = '200 OK'
		headers = [('Content-type', 'text/plain')]
		start_response(status, headers)
		return [response_body.encode("utf-8")]
	else:                                             #If not POST, just pass
		response_body = open(FILE).read()             #the html file itself
		status = '200 OK'
		headers = [('Content-type', 'text/html'),('Content-Length', str(len(response_body)))]
		start_response(status, headers)
		return [response_body.encode("utf-8")]

def open_browser():
    # Start a browser after waiting for half a second
    def _open_browser():
        webbrowser.open('http://localhost:%s/%s' % (PORT, FILE))
    thread = threading.Timer(0.5, _open_browser)
    thread.start()

def start_server():   
    httpd = make_server("", PORT, application)
    httpd.serve_forever()

if __name__ == "__main__":
    open_browser()
    start_server()