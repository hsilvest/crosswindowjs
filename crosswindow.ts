// MIT License

// Copyright (c) [2019] [CrossWindow JS]

// Source: https://github.com/hsilvest/crosswindowjs.git

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this library and associated documentation files (the "library"), to deal
// in the library without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the library, and to permit persons to whom the library is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the library.

// THE LIBRARY IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE LIBRARY OR THE USE OR OTHER DEALINGS IN THE
// LIBRARY.

class XWEvent {

    constructor(key: string, action: any) {
        this.key = key;
        this.action = action;
    }

    key: string;
    args: any;
    action: any;
}

class xw {

    static Events: XWEvent[] = [];

    static RegisterEvent(key: string, action: object) {

        if (xw.Events.filter(e => e.key === key).length > 0) {
            throw Error('An event with the given key already exist.');
        }

        xw.Events.push(new XWEvent(key, action));
    }

    static UnregisterEvent(key: string) {

        if (xw.Events.filter(e => e.key === key).length === 0) {
            throw Error('No event with the given key exist.');
        }

        xw.Events = xw.Events.filter(e => e.key !== key);
    }

    static DispatchEvent = function (key: string, args: any[] = []) {
        window.localStorage.setItem('__crossXWindows',
            JSON.stringify({ key: key, args: args })
        );
    }

}

window.onstorage = function (item: any): any {

    if (item.key === '__crossXWindows' && item.newValue) {

        let request = JSON.parse(item.newValue);

        let event = xw.Events.filter(e => e.key === request.key)[0];

        if (event) {

            var argumentCount = event.action.prototype.constructor.length;

            if (Array.isArray(request.args)) {

                if (argumentCount !== request.args.length) {
                    throw Error(`Event ${event.key} was called with ${request.args.length} argument(s) but it expected ${argumentCount} argument(s).`);
                }

                event.action.apply(null, request.args);
            }

            else {

                if (argumentCount !== 1) {
                    throw Error(`Event ${event.key} was called with 1 argument(s) but it expected ${argumentCount} argument(s).`);
               }

                event.action(request.args);
            }
        }

        else {
            throw Error(`No events registered with the key ${item.key}.`)
        }

        window.localStorage.removeItem('__crossXWindows');
    }
};

