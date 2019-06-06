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
        p.createCanvas(p.windowWidth * 0.3, p.windowWidth * 0.3);
        one = p.width / 10;
        p.noLoop();
    }
    p.draw = function () {
        p.background(250);
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
            let z = new p5(editable_sketch, box.id);     // Create new p5 INSIDE of the NEW created BOX
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
