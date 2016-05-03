#!/usr/bin/env bash

echo "creating .ssh directory ..."
cd /home/ubuntu
mkdir -p .ssh
echo "Installing the workshop's public key, use the private key with putty or openssh"
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC7ymBRUodtreE3trfzmhT92VqV1FlvoE60InQM1FXMBE1S30eAuUgg928LvhzStB6GSwuYzQpfMIU+WafeSj2j3azPfwUrTBlKpLnYTBc9FuC41kYUooC+nvEDUouSEgCZzZDGThtoTNB7R3bB8sc3grI5/4xi832NsHJU5ma/gd64nv2iJnOcXQcDHC60OZDJVjt1GaowypviWSv1Uchpr3holyJ7JO1WT7ZvljHqMmJp0bhnerupR1x/xRNVwNBIxOkmBZDkEcXwjypoif20sEvHr7UW0FWa0SkNF9Vs81ymkhlD5Yla94hBZhA3otQ5VX1R3zu1AE3HqculmA6V workshop-keypair" >> .ssh/authorized_keys
