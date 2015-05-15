##"Copyright" Extension for [Brackets](http://brackets.io)

[Brackets on GitHub](https://github.com/adobe/brackets)

This [Brackets](http://brackets.io) extension provides a quick way to insert a copyright notice at the top of your document.
The copyright text will be inserted using the appropriate comment characters based on type of file you are editing.

### Installation
* Select **File > Extension Manager**
* Click **Install from URL**
* Enter the following GitHub repository URL
* https://github.com/joeireland/brackets-extension-copyright
* Click **Install**

### How To Use
Press the **"Alt+C"** HotKey or select **"Edit > Insert Copyright"** menu item

### Configuration
* Select **Debug > Open Preferences File**
* Add **joeireland.copyright.author** set to the desired copyright author
* Add **joeireland.copyright.text** set to the desired copyright text represented
  as an array of strings (without commentting characters). Variables of ${AUTHOR}
  and ${DATE} may be used within the copyright text.
* Add **joeireland.copyright.comment-cmd** set to the desired comment command
  style. Either "edit.blockComment" or "edit.lineComment".

#####Example:
"joeireland.copyright.commentCmd": "edit.blockComment",  
"joeireland.copyright.author": "Joe Ireland",  
"joeireland.copyright.text": [  
    " The MIT License (MIT)",  
    " ",  
    " Copyright (c) ${DATE} ${AUTHOR}",  
    " ",  
    " Permission is hereby granted,free of charge, to any person obtaining a copy of",  
    " this software and associated documentation files (the \"Software\"), to deal in",  
    " the Software without restriction, includingwithout limitation the rights to",  
    " use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",  
    " the Software, and to permit persons to whom the Software isfurnished to do so,",  
    " subject to the following conditions:",  
    " ",  
    " The above copyright notice and this permission notice shall be included in all",  
    " copies or substantial portions of theSoftware.",  
    " ",  
    " THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",  
    " IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",  
    " FOR APARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",  
    " COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",  
    " IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN",  
    " CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.",
    ""  
]
