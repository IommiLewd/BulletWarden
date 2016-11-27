# PROTOTYPE #

This is a prototype of a horror side-scroller rpg game.
This prototype must be modular enough so we can implement all the
functionalities as soon as possible


## Summary ##

this prototype will try to use object oriented programming to achieve
the same result as in the parent directory.


## to update with ES6 syntax :

* boot.js       -> done
* preload.js    -> done
* firstMap.js
  * map.js
  * player.js
  * ...



## JavaScript Naming Conventions
from [Naming Convention by JSLint](http://www.j-io.org/Javascript-Naming_Conventions/#function-declaration-location)

This document defines JavaScript naming conventions, which are split into essential, coding and naming conventions.

### Contents

* Essential Conventions
  * Minimizing Globals
* Coding Conventions
  * Uses two-space indentation
  * Using shorthand for conditional statements
  * Opening Brace Location
  * Closing Brace Location
  * Function Declaration Location
  * Object Declaration
* Naming Conventions
  * Constructors
  * Methods/Functions
  * TitleCase, camelCase
  * Variables
  * Element Classes and IDs
  * Underscore Private Methods
  * No Abbreviations
  * No Plurals
  * Use Comments
  * Documentation


### Essential Conventions

Essential conventions include generic patterns that should be adhered in order to write readable, consistent and maintainable code.

#### Minimizing Globals

Variable declarations should always be made using var to not declare them as global variables. This avoids conflicts from using a variable name across different functions as well as conflicts with global variables declared by 3rd party plugins.

Good Example
```kal
function sum(x, y) {
  var result = x + y;
  return result;
}
```
Bad Example
```kal
function sum(x, y) {
  // missing var declaration, implied global
  result = x + y;
  return result;
}
```
### Coding Conventions

Coding conventions include generic patterns that ensure that written code adheres to certain formatting conventions.
Uses two-space indentation

Tabs and 2-space indentation are being used equally. Since a lot of errors on JSLint often result from mixed use of space and tab using 2 spaces throughout prevents these errors up front.

Good Example
```kal
function outer(a, b) {
  var c = 1,
    d = 2,
    inner;
  if (a > b) {
    inner = function () {
      return {
        "r": c - d
      };
    };
  } else {
    inner = function () {
      return {
        "r": c + d
      };
    };
  }
  return inner;
}  
```
Bad Example
```kal
function outer(a, b) {
var c = 1,
d = 2,
inner;

if (a > b) {
inner = function () {
return {
"r": c - d
}}}};
```
#### Using shorthand for conditional statements

An alternative for using braces is the shorthand notation for conditional statements. When using multiple conditions, the conditional statement can be split on multiple lines.

Good Example
```kal
// single line
var results = test === true ? alert(1) : alert(2);

// multiple lines
var results = (test === true && number === undefined ?
               alert(1) : alert(2));

var results = (test === true ?
               alert(1) : number === undefined ?
               alert(2) : alert(3));
```
Bad Example
```kal
// multiple conditions
var results = (test === true && number === undefined) ?
  alert(1) :
  alert(2);
```
#### Opening Brace Location

Always put the opening brace on the same line as the previous statement.

Good Example
```kal
function func () {
  return {
    "name": "Batman"
  };
}
```
Bad Example
```kal
function func()
{
  return
  {
    "name": "Batman"
  };
}  
```
#### Closing Brace Location

The closing brace should be on the same indent as the original function call.

Good Example
```kal
function func() {
  return {
    "name": "Batman"
  };
}
```
Bad Example
```kal
function func() {
  return {
           "name": "Batman"
         };
}
```
#### Function Declaration Location

Non anonymous functions should be declared before use.

Good Example
```kal
// [...]
function namedFunction() {
  return;
}
return {
  "namedFunction": namedFunction
};
```
Bad Example
```kal
// [...]
return {
  "namedFunction": function namedFunction() {
    return;
  }
};
```
#### Object Declaration

On some interpreters, declaring an object with object keys not wrapped in quotes can throw syntax errors. Here we use double quotes.

Good example
```kal
var my_object = {
  "key": "value"
};
```
Bad example
```kal
var my_object = {
  key: "value"
};
```
### Naming Conventions

Naming conventions include generic patterns for setting names and identifiers throughout a script.

#### Constructors/ Class name

A constructor function starting with new should always start with a capital letter
```kal
// good example
var test = new Application();

// bad example
var test = new application();
```
#### Methods/Functions

A method/function should always start with a small letter.
```kal
// good example
function myFunction() {...}

// bad example
function MyFunction() {...}
```
TitleCase, camelCase

Follow the camel case convention, typing the words in lower-case, only capitalizing the first letter in each word.

Examples
```kal
// Good example constructor = TitleCase
var test = new PrototypeApplication();

// Bad example constructor
var test = new PROTOTYPEAPPLICATION();
```
```kal
// Good example functions/methods = camelCase
myFunction();
calculateArea();

// Bad example functions/methods
MyFunction();
CalculateArea();  
```
#### Variables

Variables with multiple words should always use an underscore between words.

Example
```kal
// good example
var delivery_note = 1;

// bad example
var deliveryNote = 1;
```
#### Confusing variable names should end with the variable type.

Example
```kal
// implicit type
var my_callback = doSomething();
var Person = require("./person");

// confusing names + var type
var do_something_function = doSomething.bind(context);
var value_list = getObjectOrArray();
// value_list can be an object which can be cast into an array
```
To use camelCase, when sometimes it is impossible to declare a function directly, the function variable name should match some patterns which shows that it is a function.
```kal
// good example
var doSomethingFunction = function () { ... };
// or
var tool = {"doSomething": function () { ... }};

// bad example
var doSomething = function () { ... };
```

#### Element Classes and IDs

JavaScript can access elements by their ID attribute and class names. When assigning IDs and class names with multiple words, these should also be separated by an underscore (same as variables).

Example
```kal
// good example
test.setAttribute("id", "unique_identifier");
 
// bad example
test.setAttribute("id", "uniqueIdentifier");

```
Discuss - checked with jQuery UI/jQuery Mobile, they don't use written name conventions, only

* events names should fit their purpose (pageChange for changing a page)
* element classes use “-” like in ui-shadow
* "ui" should not be used by third party developers
* variables and events use lower camel-case like pageChange and activePage

#### Underscore Private Methods

Private methods should use a leading underscore to separate them from public methods (although this does not technically make a method private).

Good Example
```kal
var person = {
  "getName": function () {
    return this._getFirst() + " " + this._getLast();
  },
  "_getFirst": function () {
    // ...
  },
  "_getLast": function () {
    // ...
  }
};  
```
Bad Example
```kal
var person = {
  "getName": function () {
    return this.getFirst() + " " + this.getLast();
  },
  // private function
  "getFirst": function () {
    // ...
  }
};
```
#### No Abbreviations

Abbreviations should not be used to avoid confusion

Good Example
```kal
// delivery note
var delivery_note = 1;
```
Bad Example
```kal
// delivery note
var del_note = 1;
```
#### No Plurals

Plurals should not be used when assigning names

Good Example
```kal
var delivery_note_list = ["one", "two"];
```
Bad Example
```kal
var delivery_notes = ["one", "two"];
```
#### Use Comments

Should be used with reason but include enough information so that a reader can get a first grasp of what a part of code is supposed to do.

Good Example
```kal
var person = {
  // returns full name string
  "getName": function () {
    return this._getFirst() + " " + this._getLast();
  }
};
```
Bad Example
```kal
var person = {
  "getName": function () {
    return this._getFirst() + " " + this._getLast();
  }
};
```
#### Documentation

You can use YUIDoc (http://yuilibrary.com/projects/ yuidoc) and their custom comment tags together with Node.js to generate the documentation from the script file itself. Comments will look something like this:

Good Example
```kal
/**
 * Reverse a string
 *
 * @param  {String} input_string String to reverse
 * @return {String} The reversed string
 */
function reverse(input_string) {
  // ...
  return output_string;
};
```
Bad Example
```kal
function reverse(input_string) {
  // ...
  return output_string;
};  
```
