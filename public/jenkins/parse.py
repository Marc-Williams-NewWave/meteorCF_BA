from xml.etree import ElementTree
from xml.etree.ElementTree import Element
from xml.etree.ElementTree import SubElement
import sys
import yaml
import json
import time
import string
import subprocess

def get_server_info():
    command = 'cf curl /v2/service_plans'
    output = []
    p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    for line in p.stdout.readlines():
        if "extra" in line: print line.split(','),
        
        #out = line.translate(string.maketrans("",""), string.punctuation)
        #output.append(out)
    #print json.loads(output)
    #print output
    retval = p.wait()


job_file = 'job-template.xml'
git_url = 'https://github.com/brandon-adams/helloworld-demo.git'
node_name = 'yKPgpR-mngd-AppNode'
cell_name = 'yKPgpR-dmgr-Cell'
server_name = 'GnOEpf-srvr'
#war_file = 'was-service-broker-0.1.0.war'
war_file = 'helloworld.war'
output_file = 'demo-job.xml'

def main():
    job_info = str(sys.argv[0])
    with open('job-info.yml', 'r') as f:
        details = yaml.load(f)

    #get_server_info()
    template(details)
    #send_job()

def template(details):
    job_file = details["variables"]["job_file"]
    git_url = details["variables"]["git_url"]
    node_name = details["variables"]["node_name"]
    cell_name = details["variables"]["cell_name"]
    server_name = details["variables"]["server_name"]
    #war_file = 'was-service-broker-0.1.0.war'
    war_file = details["variables"]["war_file"]
    output_file = details["variables"]["output_file"]
    with open(job_file, 'rt') as f:
        doc = ElementTree.parse(f)

    for node in doc.iter('ipAddress'):
        #print node.tag, node.text
        node.text = '192.168.0.126'

    for node in doc.iter('port'):
        #print node.tag, node.text
        node.text = '8879'
    
    for node in doc.iter('url'):
        #print node.tag, node.text
        node.text = git_url
    
    for node in doc.iter('node'):
        #print node.tag, node.text
        node.text = node_name
    
    for node in doc.iter('cell'):
        #print node.tag, node.text
        node.text = cell_name
    
    for node in doc.iter('server'):
        #print node.tag, node.text
        node.text = server_name
    
    for node in doc.iter('artifacts'):
        #print node.tag, node.text
        node.text = "$WORKSPACE/build/libs/%s" % war_file
    
    doc.write(output_file)

def run_command(command):
    print command
    p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    for line in p.stdout.readlines():
        print line,
    retval = p.wait()

def send_job():
    command = "java -jar jenkins-cli.jar -i id_rsa.pub -s http://192.168.0.126:8090/ create-job helloworld-demo < %s" % output_file 
    run_command(command)
    print "Waiting..."
    time.sleep(10)
    
    print "Building..."
    command = "java -jar jenkins-cli.jar -i id_rsa.pub -s http://192.168.0.126:8090/ build -v helloworld-demo"
    run_command(command)
    print "Done build?"
    time.sleep(10)
    
    #print "Deleting..."
    #command = "java -jar jenkins-cli.jar -s http://192.168.0.126:8090/ delete-job helloworld-demo"
    #run_command(command)
    #time.sleep(5)
    
main()