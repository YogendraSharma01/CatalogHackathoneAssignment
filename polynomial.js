const BigInt = require('big-integer'); // Use a library for handling large integers in JavaScript

const decodeValue = (value, base) => {
    return BigInt(parseInt(value, parseInt(base)));
};

const parseInput = (jsonInput) => {
    const data = JSON.parse(jsonInput);
    const n = data.keys.n;
    const k = data.keys.k;

    const points = [];

    for (const key in data) {
        if (key === "keys") continue;
        const base = data[key].base;
        const encodedValue = data[key].value;
        const x = BigInt(key);
        const y = decodeValue(encodedValue, base);
        points.push([x, y]);
    }

    return { n, k, points };
};

const lagrangeInterpolation = (points) => {
    const n = points.length;

    const L = (x, i) => {
        const [xi, yi] = points[i];
        let li = BigInt(1);
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const [xj] = points[j];
                li = li.multiply(x.subtract(xj)).divide(xi.subtract(xj));
            }
        }
        return li;
    };

    const P = (x) => {
        return points.reduce((result, [xi, yi], i) => result.add(yi.multiply(L(x, i))), BigInt(0));
    };

    return P(BigInt(0));
};

const findConstantTerm = (jsonInput) => {
    const { n, k, points } = parseInput(jsonInput);

    if (points.length < k) {
        throw new Error("Not enough points to determine the polynomial.");
    }

    return lagrangeInterpolation(points);
};

// Test case JSON inputs
const jsonInput1 = `
{
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
}
`;

const jsonInput2 = `
{
    "keys": {
        "n": 9,
        "k": 6
    },
    "1": {
        "base": "10",
        "value": "28735619723837"
    },
    "2": {
        "base": "16",
        "value": "1A228867F0CA"
    },
    "3": {
        "base": "12",
        "value": "32811A4AA0B7B"
    },
    "4": {
        "base": "11",
        "value": "917978721331A"
    },
    "5": {
        "base": "16",
        "value": "1A22886782E1"
    },
    "6": {
        "base": "10",
        "value": "28735619654702"
    },
    "7": {
        "base": "14",
        "value": "71AB5070CC4B"
    },
    "8": {
        "base": "9",
        "value": "122662581541670"
    },
    "9": {
        "base": "8",
        "value": "642121030037605"
    }
}
`;

const runTestCase = (jsonInput) => {
    try {
        const c = findConstantTerm(jsonInput);
        console.log(`The constant term of the polynomial is: ${c.toString()}`);
    } catch (error) {
        console.error(error.message);
    }
};

// Run both test cases
console.log("Running Test Case 1:");
runTestCase(jsonInput1);

console.log("\nRunning Test Case 2:");
runTestCase(jsonInput2);
