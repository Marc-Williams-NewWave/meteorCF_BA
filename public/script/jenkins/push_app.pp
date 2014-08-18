$filename = "/home/opstack/bosh-workspace/jenkins/was-broker-job.xml"
$repo = "http://github.com/brandon-adams/cf-oracle-servicebroker.git"

file { $filename :
  ensure => present,
}->
file_line { 'Edit the git repo for template':
  path => $filename,  
  line => "<url>${repo}</url>",
  match => "^.*<url>http://github.com/brandon-adams/cf-was-servicebroker.git</url>",
}

#augeas { "Edit git repo":
#  lens    => "Xml.lns",
#  incl    => "/files/home/opstack/bosh-workspace/jenkins/was-broker-job.xml",
#  #context => "/files/home/opstack/bosh-workspace/jenkins/was-broker-job.xml",
#  changes => [
#              "set /project/scm/userRemoteConfigs/hudson.plugins.git.UserRemoteConfig/url http://github.com/brandon-adams/cf-oracle-servicebroker.git"
#              ],
#}
