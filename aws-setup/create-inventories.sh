#!/usr/bin/env bash

# Creates inventory files, copies of group1_staging and group2_production
# The script creates 20 groups

cd groups
for i in $(seq 2 20);
do
cp group1_production "group${i}_production";
cp group1_staging "group${i}_staging";
sed -i s/group1/group${i}/g group${i}_production group${i}_staging;
done
cd ..