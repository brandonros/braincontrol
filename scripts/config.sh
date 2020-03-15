#!/bin/sh
HOSTNAME=$(hostname)
ENV=$([ "$HOSTNAME" = "variantcoding" ] && echo 'production' || echo 'local')
