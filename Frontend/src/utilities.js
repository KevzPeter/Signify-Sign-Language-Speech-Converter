// Define our labelmap
const labelMap = {
  1: { name: "Hello", color: "red" },
  2: { name: "Thank You", color: "yellow" },
  3: { name: "I Love You", color: "lime" },
  4: { name: "Yes", color: "blue" },
  5: { name: "No", color: "purple" },
};

export const getText = (boxes, classes, scores, threshold) => {
  const arr = [0, 0, 0, 0, 0];
  for (let i = 0; i <= boxes.length; i++) {
    if (boxes[i] && classes[i] && scores[i] > threshold) {
      arr[classes[i] - 1] += 1;
    }
  }
  const max = indexOfMax(arr);
  return labelMap[max + 1]["name"];
};

function indexOfMax(arr) {
  var max = arr[0];
  var maxIndex = 0;
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }
  return maxIndex;
}
// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) => {
  for (let i = 0; i <= boxes.length; i++) {
    if (boxes[i] && classes[i] && scores[i] > threshold) {
      // Extract variables
      const [y, x, height, width] = boxes[i];
      const text = classes[i];

      // Set styling
      ctx.strokeStyle = labelMap[text]["color"];
      ctx.lineWidth = 10;
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";

      // DRAW!!
      ctx.beginPath();
      ctx.fillText(labelMap[text]["name"] + " - " + Math.round(scores[i] * 100) / 100, x * imgWidth, y * imgHeight - 10);
      ctx.rect(x * imgWidth, y * imgHeight, (width * imgWidth) / 2, (height * imgHeight) / 1.5);
      ctx.stroke();
    }
  }
};
