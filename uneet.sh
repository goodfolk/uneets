#!/bin/bash
if [ -z "$1" ]
then
  echo "Please specify a uneet name (u_name)"
else
  gulp uneets --make $1
fi
