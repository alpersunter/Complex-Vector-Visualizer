// Sketch for result
let equals_sketch = function (p) {
    const colors_anchor = [p.color(220, 70, 30, 220), p.color(70, 220, 30,220), p.color(30, 70, 220,220)];
    const colors_ghost = [p.color(220, 70, 30, 80), p.color(70, 220, 30,80), p.color(30, 70, 220,80)];
    let color = colors_anchor;
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


    p.setup = function () {
        p.canvas = p.createCanvas(50, 50);
        const w = p.canvas.elt.parentElement.clientWidth;
        const h = p.canvas.elt.parentElement.clientHeight;
        p.resizeCanvas(w, h);
        p.one = p.width / 3;
        p.noLoop();
    }
    p.draw = function () {
        p.background(250);
        color = colors_anchor;
        let z = p.dot(p.v, p.w);
        color = colors_ghost;
        let zg = p.dot(p.vg, p.wg);     // tüm bileşenler anchordan olmalı, üstünde hayalet olan hariç
        // console.log("Result: " + z.toString());
        complexUnitCircle(p, p.one);
        show(p, z, true, p.color(0), p.color(30,50));
        //show(p, zg, true);
    }
    p.zoomBy = function (z) {
        p.one *= z;
    }
    // Calculates dot product
    p.dot = function (vec, wec) {
        p.textSize(32);
        p.strokeWeight(1);
        const v_size = vec.length;
        const w_size = wec.length;
        let sum = Complex['ZERO'];
        if (v_size == w_size) {
            p.push();
            for (let i = 0; i < v_size; i++) {
                let v = vec[i];
                let w = wec[i];
                let _w = w.conjugate();
                let product = v.mul(_w);
                show(p, product, false, color[i]);
                p.push();
                p.translate(p.width/2, p.height/2);
                p.stroke(color[i]);
                p.fill(color[i]);
                p.rotate(-product.arg());
                p.translate(product.abs() * p.one/2, 0);
                p.rotate(product.arg());

                if(product.abs()>0.25)
                p.text("z"+String.fromCharCode(8320+i)+"w"+String.fromCharCode(773)+String.fromCharCode(8320+i), 0, 0);
                p.pop();

                p.translate(product.re * p.one, -product.im * p.one);
                sum = sum.add(product);
            }
            p.pop();
        } else {
            throw new Error("Vector sizes don't match!");
        }
        return sum;
    }
}
// Zs: array of p5 instances
let Zs = [];


window.onload = function () {
    const colors_anchor = (p=>[p.color(220, 70, 30, 220), p.color(70, 220, 30,220), p.color(30, 70, 220,220)]);
    const colors_ghost = (p=>[p.color(220, 70, 30, 80), p.color(70, 220, 30,80), p.color(30, 70, 220,80)]);
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
            let z = new p5(editable_sketch, box.id);     // Create new p5 INSIDE of the NEW created BOX
            z.solid_color = colors_anchor(z)[j];
            z.ghost_color = colors_ghost(z)[j];
            Zs.push(z);
        }
    });

    // Equals:
    // p5 instance of result of dot product
    const Z_Eq = new p5(equals_sketch, "equals")
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

    let leaveHandler = (function (e) {
        // GHOST
        // First argument of dot product
        Z_Eq.vg = [Complex['ZERO'], Complex['ZERO'], Complex['ZERO']];
        // Second argument of dot product
        Z_Eq.wg = [Complex['ZERO'], Complex['ZERO'], Complex['ZERO']];
        Z_Eq.redraw();
    });
    const sectors = Array.from(document.getElementsByTagName("canvas"));
    sectors.forEach(sector => { sector.addEventListener("mouseout", leaveHandler); });


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

    let resizeHandler = (function (e) {
        const p5s = Zs.concat([Z_Eq]);
        p5s.forEach(p => {
            const w = p.canvas.elt.parentElement.clientWidth;
            const h = p.canvas.elt.parentElement.clientHeight;
            p.resizeCanvas(w, h);
            p.one = p.width / 2 - 20;
        });
    });
    window.addEventListener("resize", resizeHandler);
}
