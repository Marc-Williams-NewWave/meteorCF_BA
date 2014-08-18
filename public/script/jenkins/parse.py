from xml.etree import ElementTree
from xml.etree.ElementTree import Element
from xml.etree.ElementTree import SubElement
import sys
import json
import time
import subprocess

#job_file = str(sys.argv[0])
#git_url = str(sys.argv[1])
#node_name = str(sys.argv[2])
#cell_name = str(sys.argv[3])
#server_name = str(sys.argv[4])
#war_file = str(sys.argv[5])

#command = 'cf curl /v2/service_plans'
#output = ''
#p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
#for line in p.stdout.readlines():
#    print line,
    #output += line,
#print json.loads(output)
#retval = p.wait()


job_file = 'was-broker-job.xml'
git_url = 'https://github.com/brandon-adams/helloworld-ruby.git'
node_name = 'ltJwo7-mngd-AppNode'
cell_name = 'ltJwo7-dmgr-Cell'
server_name = 'TWVORA-srvr'
war_file = 'helloworld.war'
output_file = 'demo-job.xml'

def main():
    template()
    send_job()

def template():
    with open(job_file, 'rt') as f:
        doc = ElementTree.parse(f)
    
    for node in doc.iter('url'):
        print node.tag, node.text
        node.text = git_url
    
    for node in doc.iter('node'):
        print node.tag, node.text
        node.text = node_name
    
    for node in doc.iter('cell'):
        print node.tag, node.text
        node.text = cell_name
    
    for node in doc.iter('server'):
        print node.tag, node.text
        node.text = server_name
    
    for node in doc.iter('artifacts'):
        print node.tag, node.text
        node.text = "$WORKSPACE/build/libs/%s" % war_file
    
    doc.write(output_file)

def run_command(command):
    print command
    p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    for line in p.stdout.readlines():
        print line,
    retval = p.wait()

def send_job():
    command = "java -jar jenkins-cli.jar -s http://192.168.0.126:8090/ create-job helloworld-demo < %s" % output_file 
    run_command(command)
    print "Waiting..."
    time.sleep(10)
    
    print "Building..."
    command = "java -jar jenkins-cli.jar -s http://192.168.0.126:8090/ build -v helloworld-demo"
    run_command(command)
    print "Done build?"
    time.sleep(10)
    
    #print "Deleting..."
    #command = "java -jar jenkins-cli.jar -s http://192.168.0.126:8090/ delete-job helloworld-demo"
    #run_command(command)
    #time.sleep(5)
    
main()
