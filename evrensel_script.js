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
    p.stroke('#CD0000');
    p.line(p.width / 2, 0, p.width / 2, p.height);
    // Green for real
    p.stroke('#00CD00');
    p.line(0, p.height / 2, p.width, p.height / 2);

    // Draw the unit circle
    p.noFill();
    p.stroke(47, 79, 79);
    p.strokeWeight(1);
    p.circle(p.width / 2, p.height / 2, 2 * one);
}
function show(p, w, one, ghost = false, solid_color = p.color(47, 79, 79, 220), ghost_color = p.color(47, 79, 79, 80)) {
    p.push();
    p.strokeWeight(3);
    if (!ghost) {
        p.stroke(solid_color);
        p.fill(solid_color);
    } else {
        p.stroke(ghost_color);
        p.fill(ghost_color);
    }

    p.translate(p.width / 2, p.height / 2);
    w = w.mul(new Complex(one, 0));
    p.line(0, 0, w.re, -w.im);
    p.noStroke();

    p.circle(w.re, -w.im, p.width / 20);
    p.pop();
}

// GLOBAL ZOOM FOR EVERY VIEW
var GLOBAL_ZOOM = 1;

// Global event:
var componentUpdate = new CustomEvent("componentUpdate", {
    bubbles: true,
    detail: {
        hazcheeseburger: true // I didn't remove this line, because it does not cause any harm and I think z is a funny replacement for s.
    }
});

// Sketch for each component
// unaware of its surroundings and only controlled by ´W´ and ´zoomBy´
let editable_sketch = function (p) {
    let one;
    let canvas;
    p.setup = function () {
        canvas = p.createCanvas(100, 100);
        const w = canvas.elt.parentElement.clientWidth;
        const h = canvas.elt.parentElement.clientHeight;
        p.resizeCanvas(w, h);
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
        p.solid_color = p.color(47, 79, 79, 220);
        p.ghost_color = p.color(47, 79, 79, 80);
    };
    p.draw = function () {
        p.background(250);
        complexUnitCircle(p, one);

        // Draw vector from center to cursor (only if mouse if hovering)
        const hovering = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
        if (hovering) {
            // p.line(p.width / 2, p.height / 2, p.mouseX, p.mouseY);
            // Calculate real and complex components of that vector
            const re = (p.mouseX - p.width / 2) / one;
            const im = (p.height / 2 - p.mouseY) / one;
            p.W_ghost = new Complex(re, im);
            show(p, p.W_ghost, one, true, p.solid_color, p.ghost_color);
            // If user clicks, anchor that vector.
            if (p.mouseIsPressed) {
                p.W = p.W_ghost;
            }
        } else {
            p.W_ghost = p.W;
        }
        show(p, p.W, one, false, p.solid_color, p.ghost_color);
    };
    p.zoomBy = function (z) {
        one *= z;
    }
}