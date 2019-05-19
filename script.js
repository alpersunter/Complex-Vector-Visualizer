// Sketch for each component
let sketch = function (p) {
    let one;
    p.setup = function () {
        p.createCanvas(300, 300);
        p.W = Complex['ZERO'];
        one = p.width / 2 - 20;
        p.noLoop();
    };
    p.draw = function () {
        p.background(255);
        complexUnitCircle();
        show(p.W);
    };
    function complexUnitCircle() {
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
    function show(w) {
        p.push();
        p.strokeWeight(3);
        p.stroke(87, 144, 193);
        p.translate(p.width / 2, p.height / 2);
        w = w.mul(new Complex(one, 0));
        p.line(0, 0, w.re, -w.im);
        p.noStroke();
        p.fill(87, 144, 193);
        p.circle(w.re, -w.im, p.width / 20);
        p.pop();
    }
}

// Sketch for result
let equals_sketch = function (p) {
    // First argument of dot product
    p.v = [Complex['ZERO'], Complex['ZERO'], Complex['ZERO']];
    // Second argument of dot product
    p.w = [Complex['ZERO'], Complex['ZERO'], Complex['ZERO']];

    let one;
    p.setup = function () {
        p.createCanvas(500, 500)
        one = p.width / 2 - 20;
        p.noLoop();
    }
    p.draw = function () {
        p.background(250,200,210);
        let z = p.dot();
        console.log("Result: " + z.toString());
        show(z);
    }

    // Calculates dot product
    p.dot = function () {
        // Dot product is calculated by first conjugating each component of second argument (p.w)
        // Then elementwise multiplication is required
        const v_size = p.v.length;
        const w_size = p.w.length;
        let sum = Complex['ZERO'];
        if (v_size == w_size) {
            for (let i = 0; i < v_size; i++) {
                let v = p.v[i];
                let w = p.w[i];
                let _w = w.conjugate();
                let product = v.mul(_w);
                sum = sum.add(product);
            }
        } else {
            throw new Error("Vector sizes don't match!");
        }
        return sum;
    }

    // Duplicate codee!!!!!!!!!!
    function show(w) {
        p.push();
        p.strokeWeight(3);
        p.stroke(87, 144, 193);
        p.translate(p.width / 2, p.height / 2);
        w = w.mul(new Complex(one, 0));
        p.line(0, 0, w.re, -w.im);
        p.noStroke();
        p.fill(87, 144, 193);
        p.circle(w.re, -w.im, p.width / 20);
        p.pop();
    }
}
// Zs: array of p5 instances
let Zs = [];

const welcome = "Hey, curious!\nFeel free to play with my code.\nIf you need any help, reach me at alpersunter@mail.ru or at https://github.com/alpersunter\nHappy inspecting :)";
window.onload = function () {
    console.log(welcome);

    // Get vectors
    const vectors = Array.from(document.getElementsByClassName("vector"));
    let componentUpdate = new CustomEvent("componentUpdate", {
        detail: {
            hazcheeseburger: true // I didn't remove this line, because it does not cause any harm and I think z is a funny replacement for s.
        }
    });
    // Fill those vectors with components
    for (let i = 0; i < vectors.length; i++) {
        const vector = vectors[i];
        for (let j = 0; j < 3; j++) {
            // Create "box"
            let box = document.createElement("div");
            // Set its class
            box.className = "box";
            // Add box as a child to body
            vector.appendChild(box);
            box.id = "Z_" + i.toString() + "_" + j.toString();
            // Create "input"
            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = "a + bi";
            // Add input as a child to box
            box.appendChild(input);
            let z = new p5(sketch, box.id);
            Zs.push(z);
        }
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
    }

    // Equals:
    // p5 instance of result of dot product
    const Z_Eq = new p5(equals_sketch, "equals")
    // box of Z_Eq
    const Z_Eq_box = Z_Eq.canvas.parentElement;

    // When "Z_Eq_box" hears that "a component is updated", "dot product should be recalculated"
    Z_Eq_box.addEventListener("componentUpdate", function (eventArgs) {
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

        // Sonra da redraw
        Z_Eq.redraw();
    });
}
