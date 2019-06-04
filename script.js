// Common functions between sketches:
function complexUnitCircle(p, one) {
    // // Write labels "i" and "1" indicating imaginary and real units
    // p.textSize(20);
    // p.noStroke();
    // // Red for i
    // p.fill(230, 0, 0);
    // p.text("i", p.width / 2 + 10, 18);
    // // Green for 1
    // p.fill(0, 180, 0);
    // p.text("1", p.width - 20, p.height / 2 - 10);

    // Draw axes
    p.strokeWeight(2);
    // Red for imaginary
    p.stroke(230, 0, 0);
    p.line(p.width / 2, 0, p.width / 2, p.height);
    // Green for real
    p.stroke(0, 180, 0);
    p.line(0, p.height / 2, p.width, p.height / 2);

    // Draw the unit circle
    p.noFill();
    p.stroke(50);
    p.strokeWeight(1);
    p.circle(p.width / 2, p.height / 2, 2 * one);
}
function show(p, w, one, ghost = false) {
    p.push();
    p.strokeWeight(3);
    if (!ghost) {
        p.stroke(87, 144, 193);
        p.fill(87, 144, 193);
    } else {
        p.stroke(87, 144, 193, 100);
        p.fill(87, 144, 193, 100);
    }

    p.translate(p.width / 2, p.height / 2);
    w = w.mul(new Complex(one, 0));
    p.line(0, 0, w.re, -w.im);
    p.noStroke();

    p.circle(w.re, -w.im, p.width / 20);
    p.pop();
}

// Sketch for each component
// unaware of its surroundings and only controlled by ´W´ and ´zoomBy´
let sketch = function (p) {
    let one;
    let canvas;
    p.setup = function () {
        canvas = p.createCanvas(p.windowHeight * 0.26, p.windowHeight * 0.26);
        canvas.elt.addEventListener("mousemove", e => {
            e.target.dispatchEvent(componentUpdate);
        });
        canvas.elt.addEventListener("click", e => {
            e.target.dispatchEvent(componentUpdate);
        });
        p.W = Complex['ZERO'];          // This is anchored (only modified when mouse clicks down)
        p.W_ghost = Complex['ZERO'];    // This is ghost (actively modified by mouse position)
        one = p.width / 2 - 20;
        // p.noLoop();
    };
    p.draw = function () {
        p.background(255);
        complexUnitCircle(p, one);

        // Draw vector from center to cursor (only if mouse if hovering)
        const hovering = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
        if (hovering) {
            p.line(p.width / 2, p.height / 2, p.mouseX, p.mouseY);
            // Calculate real and complex components of that vector
            const re = (p.mouseX - p.width / 2) / one;
            const im = (p.height / 2 - p.mouseY) / one;
            p.W_ghost = new Complex(re, im);
            show(p, p.W_ghost, one, true);
            // If user clicks, anchor that vector.
            if (p.mouseIsPressed) {
                p.W = p.W_ghost;
            }
        } else {
            p.W_ghost = p.W;
        }
        show(p, p.W, one);
    };
    p.zoomBy = function (z) {
        one *= z;
    }
}

// Sketch for result
let equals_sketch = function (p) {
    // ANCHOR
    // First argument of dot product
    p.v = [Complex['ZERO'], Complex['ZERO'], Complex['ZERO']];
    // Second argument of dot product
    p.w = [Complex['ZERO'], Complex['ZERO'], Complex['ZERO']];

    // GHOST
    // First argument of dot product
    p.vg = [Complex['ZERO'], Complex['ZERO'], Complex['ZERO']];
    // Second argument of dot product
    p.wg = [Complex['ZERO'], Complex['ZERO'], Complex['ZERO']];

    let one;
    p.setup = function () {
        p.createCanvas(p.windowWidth * 0.4, p.windowWidth * 0.4);
        one = p.width / 10;
        p.noLoop();
    }
    p.draw = function () {
        p.background(250, 200, 210);
        let z = p.dot(p.v, p.w);
        let zg = p.dot(p.vg, p.wg);     // tüm bileşenler anchordan olmalı, üstünde hayalet olan hariç
        // console.log("Result: " + z.toString());
        complexUnitCircle(p, one);
        show(p, z, one);
        show(p, zg, one, true);
    }
    p.zoomBy = function (z) {
        one *= z;
    }
    // Calculates dot product
    p.dot = function (vec, wec) {
        const v_size = vec.length;
        const w_size = wec.length;
        let sum = Complex['ZERO'];
        if (v_size == w_size) {
            for (let i = 0; i < v_size; i++) {
                let v = vec[i];
                let w = wec[i];
                let _w = w.conjugate();
                let product = v.mul(_w);
                sum = sum.add(product);
            }
        } else {
            throw new Error("Vector sizes don't match!");
        }
        return sum;
    }
}
// Zs: array of p5 instances
let Zs = [];

// GLOBAL ZOOM FOR EVERY VIEW
let GLOBAL_ZOOM = 1;

// Global event:
var componentUpdate = new CustomEvent("componentUpdate", {
    bubbles: true,
    detail: {
        hazcheeseburger: true // I didn't remove this line, because it does not cause any harm and I think z is a funny replacement for s.
    }
});

const welcome = "Hey, curious!\nFeel free to play with my code.\nIf you need any help, reach me at alpersunter@mail.ru or at https://github.com/alpersunter\nHappy inspecting :)";
window.onload = function () {
    console.log(welcome);

    // Get vectors (DIV's whose class is VECTOR)
    const vectors = Array.from(document.getElementsByClassName("vector"));

    // Fill those vectors with components

    vectors.forEach((vector, i) => {            // For each div with class "vector" in body
        for (let j = 0; j < 3; j++) {           // For each component of a vector
            // Create "box"
            let box = document.createElement("div");
            box.className = "box";              // Set its class for CSS
            vector.appendChild(box);            // Add box as a child to current "vector"
            box.id = "Z_" + i.toString() + "_" + j.toString();
            /*
            // Create "input"
            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = "a + bi";
            // Add input as a child to box
            box.appendChild(input);
            */
            let z = new p5(sketch, box.id);     // Create new p5 INSIDE of the NEW created BOX
            Zs.push(z);                         // 
        }
        /*
        Zs.forEach(element => {
            const Z_box = element.canvas.parentElement; // Bu çok iyi oldu! 
            // İleride yeni örnekler eklemek çok kolay olacak.
            const Z_input = Z_box.querySelector("input");
            const changeHandler = function (e) {
                let userInput = e.srcElement.value;
                let c;
                try {                           // Try parsing user input.
                    c = new Complex(userInput);
                } catch (error) {               // If user input was bad:
                    console.log(error.message + ": Enter a complex number like '3' or '5i' or '3 - 5i'");
                    c = Complex['ZERO'];
                }
                // Update Z.W
                element.W = c;
                e.srcElement.value = c.toString();
                element.redraw();
                // Send this change to result viewer
                Z_Eq_box.dispatchEvent(componentUpdate);
            };
            Z_input.addEventListener("change", changeHandler)
        });
        */
    });


    // Equals:
    // p5 instance of result of dot product
    const Z_Eq = new p5(equals_sketch, "equals")
    // box of Z_Eq
    const Z_Eq_box = Z_Eq.canvas.parentElement;

    // When "body" hears that "a component is updated", "dot product should be recalculated"
    let updateZ_Eq_box = function (eventArgs) {
        // ANCHOR:

        // Her bir bileşenden veri çek ve Z_Eq'e ekle
        let reducer = (accumulator, currentValue) => {
            // Push returns the new length of array, so without "return accumulator", 
            // next acc is set to a number -which does not have a .push() method.-
            accumulator.push(currentValue.W);
            return accumulator;
        };
        let Ws = []; // Only complex number Ws stored in Zs (p5 instances)
        Ws = Zs.reduce(reducer, []); // Initialize accumulator as an empty array []

        Z_Eq.v = Ws.slice(start = 0, end = Z_Eq.v.length);
        Z_Eq.w = Ws.slice(start = Z_Eq.w.length);

        // GHOST:

        // Her bir bileşenden veri çek ve Z_Eq'e ekle
        let reducer_ghost = (accumulator, currentValue) => {
            // Push returns the new length of array, so without "return accumulator", 
            // next acc is set to a number -which does not have a .push() method.-
            accumulator.push(currentValue.W_ghost);
            return accumulator;
        };
        let ghosts = []; // Only complex number Ws stored in Zs (p5 instances)
        ghosts = Zs.reduce(reducer_ghost, []); // Initialize accumulator as an empty array []

        Z_Eq.vg = ghosts.slice(start = 0, end = Z_Eq.vg.length);
        Z_Eq.wg = ghosts.slice(start = Z_Eq.wg.length);

        // Sonra da redraw
        Z_Eq.redraw();
    };
    document.body.addEventListener("componentUpdate", updateZ_Eq_box);


    // Change scale of boxes by scrolling
    let zoom = function (event) {
        event.preventDefault();

        if (event.deltaY < 0) {
            // Zoom in
            GLOBAL_ZOOM = 1.2;
        }
        else {
            // Zoom out
            GLOBAL_ZOOM = 0.8;
        }

        // Restrict scale
        GLOBAL_ZOOM = Math.min(Math.max(.125, GLOBAL_ZOOM), 4);
        Zs.forEach(element => {
            element.zoomBy(GLOBAL_ZOOM);
            element.redraw();
        });
        Z_Eq.zoomBy(GLOBAL_ZOOM);
        Z_Eq.redraw();
    };
    // Listen for mouse wheel
    document.getElementById("main").addEventListener("wheel", zoom);
}
