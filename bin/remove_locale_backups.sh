#!/usr/bin/env bash
# Remove the backups from all the locale files.

if [[ ! -f /usr/bin/msgattrib ]]; then
    echo 'msgattrib not installed. Check you have installed gettext utils for your platform'
fi

for path in ./locale/*; do
    [ -d "${path}" ] || continue
    dirname="$(basename ${path})"
    [ $dirname=='templates' ] && continue
    popath="./locale/${dirname}/LC_MESSAGES/messages.po"
    /usr/bin/msgattrib --no-obsolete --output-file=${popath} ${popath}
done
