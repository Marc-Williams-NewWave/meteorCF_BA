from xml.etree import ElementTree
from xml.etree.ElementTree import Element
from xml.etree.ElementTree import SubElement
import sys
import os
import yaml
import json
import time
import string
import argparse
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

def build_manifest(details):

    template = "template_manifest.yml"
    output_file = "ex_manifest.yml"
    #template = details["template_file"]
    #output_file = details["output_file"]
    in_stream = open(template, "r")
    manifest = yaml.load(in_stream)
    
    #app_name = "hello"
    #memory = "128M"
    #inst = 1
    #disk = "128M"
    #host = "hello"
    #path = "$WORKSPACE/cf_demoapp_ruby_rack/"
    #timeout = 120
    #command = ""
    #buildpack = "Ruby"

    app_name = details["app_name"]
    memory = details["memory"]
    inst = details["inst"]
    disk = details["disk"]
    host = details["host"]
    path = details["path"]
    #timeout = details["app_name"]
    #command = details["app_name"]
    buildpack = details["buildpack"]

    manifest["applications"][0]["name"] = app_name
    manifest["applications"][0]["memory"] = memory
    manifest["applications"][0]["instances"] = inst
    manifest["applications"][0]["disk_quota"] = disk
    manifest["applications"][0]["host"] = host
    manifest["applications"][0]["path"] = "$WORKSPACE/" + path
    #manifest["applications"][0]["timeout"] = timeout
    #manifest["applications"][0]["command"] = command
    if manifest["applications"][0]["buildpack"] != 'None':
        manifest["applications"][0]["buildpack"] = buildpack

    out_stream = open(output_file, "w")
    yaml.dump(manifest, out_stream, explicit_start=True, default_flow_style=False)
    #print yaml.dump(manifest, explicit_start=True, default_flow_style=False)

def json_template(details):
    #job_file = details["variables"]["job_file"]
    job_file = "%s/no-webs.xml" % "/Users/Marc/dev/code/meteorite/ba_demo_NEW/public/jenkins"
    git_url = details["git_url"]
    #git_url = str(sys.argv[2])
    #node_name = details["variables"]["node_name"]
    #cell_name = details["variables"]["cell_name"]
    #server_name = details["variables"]["server_name"]
    #war_file = 'was-service-broker-0.1.0.war'
    #war_file = details["variables"]["war_file"]
    #output_file = details["variables"]["output_file"]
    output_file = "%s/demo-job.xml" % "/Users/Marc/dev/code/meteorite/ba_demo_NEW/public/jenkins"
    with open(job_file, 'rt') as f:
        doc = ElementTree.parse(f)

    for node in doc.iter('ipAddress'):
        print node.tag, node.text
        #node.text = '192.168.0.126'

    for node in doc.iter('port'):
        print node.tag, node.text
        #node.text = '8882'
    
    for node in doc.iter('url'):
        #print node.tag, node.text
        node.text = git_url
    
    for node in doc.iter('node'):
        print node.tag, node.text
        #node.text = node_name
    
    for node in doc.iter('cell'):
        print node.tag, node.text
        #node.text = cell_name
    
    for node in doc.iter('server'):
        print node.tag, node.text
        #node.text = server_name
    
    for node in doc.iter('artifacts'):
        print node.tag, node.text
        #node.text = "$WORKSPACE/build/libs/%s" % war_file
    
    doc.write(output_file)

def run_command(command):
    print command
    p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    for line in p.stdout.readlines():
        print line,
    retval = p.wait()

def create_job(details):

    #output_file = details["variables"]["output_file"]
    output_file = "%s/demo-job.xml" % "/Users/Marc/dev/code/meteorite/ba_demo_NEW/public/jenkins"
    job_name = details["app_name"]

    command = "java -jar /Users/Marc/dev/code/meteorite/ba_demo_NEW/public/jenkins/jenkins-cli.jar -s http://192.168.0.126:8090/ create-job %s < %s" % (job_name, output_file) 
    run_command(command)
    print "Waiting..."
    time.sleep(10)
    
    print "Building..."
    command = "java -jar /Users/Marc/dev/code/meteorite/ba_demo_NEW/public/jenkins/jenkins-cli.jar -s http://192.168.0.126:8090/ build -v %s" % job_name
    run_command(command)
    print "Done build?"
    time.sleep(10)
    
def delete_job(details):

    #job_name = details["variables"]["job_name"]
    job_name = "test_App"
    print "Deleting..."
    command = "java -jar jenkins-cli.jar -s http://192.168.0.126:8090/ delete-job %s" % job_name
    run_command(command)
    time.sleep(5)

def main():

    parser = argparse.ArgumentParser(description='Launch some apps to Jenkins and CF. Purely backend.')
    
    parser.add_argument('name', help='Name of application to launch in CF. Also used for Jenkins job.')
    parser.add_argument('git_url', help='Github URL for project')
    parser.add_argument('--num_inst', nargs='?', type=int, default='1', help='Number of instances to launch in CF.')
    parser.add_argument('--mem', nargs='?', default='512M', help='Amount of memory to use in CF. Defaults to 512M.')
    parser.add_argument('--disk', nargs='?', default='512M', help='Amount of disk space to use in CF. Defaults to 512M.')
    parser.add_argument('--buildpack', nargs='?', help='Override buildpack use in CF here.')
    #parser.add_argument('--host', nargs='?', default='', help='Hostname for the application in CF.')
    parser.add_argument('--path', nargs='?', default='$WORKSPACE/build/libs/*.war', help='Path to the WAR file.')
    parser.add_argument('--start', action='store_true', help='Set to 1 to launch in CF.')
    args = parser.parse_args()

    details = {}
    details["app_name"] = args.name
    details["memory"] = args.mem
    details["inst"] = args.num_inst
    details["disk"] = args.disk
    details["host"] = args.name
    details["path"] = args.path
    details["buildpack"] = args.buildpack
    details["start"] = args.start
    
    if args.start:
        print "launching"
    print details
    #in_stream = open(file_name, "r")
    #app_details = yaml.load(in_stream)
    #get_server_info()
    build_manifest(details)
    #json_template(details)
    #create_job(details)
    #delete_job(details)

main()
