# Two Way Messaging Chromium Extension

This Chromium Extension demonstrate communication between web page, content, options and background page.


We have a timers in background, content and options pages. Each timer sends messages. Also we have 3 buttons on the WEB page to initialize sending message manually.

# Google Chrome

To make it works its requaried to edit manifest and specify the https://whitelisted_hosts (note https!)

# How to

1) install crx

2) open https://localhost, there are added 3 buttons at the top

3) open with debugger  https://localhost, you should see logs from inject script and content script

4) open with debugger inspector background page

5) open with debugger inspector options page

You should see logs on messages events.
Try click the buttons on the localhost page and see results in content and background.