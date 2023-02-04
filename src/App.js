import { useCallback, useEffect, useState } from "react";
import "./App.css";
const buttons = [
  {
    id: "zero",
    keyTrigger: "0",
    textButton: "0",
  },
  {
    id: "one",
    keyTrigger: "1",
    textButton: "1",
  },
  {
    id: "two",
    keyTrigger: "2",
    textButton: "2",
  },
  {
    id: "three",
    keyTrigger: "3",
    textButton: "3",
  },
  {
    id: "four",
    keyTrigger: "4",
    textButton: "4",
  },
  {
    id: "five",
    keyTrigger: "5",
    textButton: "5",
  },
  {
    id: "six",
    keyTrigger: "6",
    textButton: "6",
  },
  {
    id: "seven",
    keyTrigger: "7",
    textButton: "7",
  },
  {
    id: "eight",
    keyTrigger: "8",
    textButton: "8",
  },
  {
    id: "nine",
    keyTrigger: "9",
    textButton: "9",
  },
  {
    id: "decimal",
    keyTrigger: ".",
    textButton: ".",
  },
  {
    id: "equals",
    keyTrigger: "Enter",
    textButton: "=",
  },
  {
    id: "divide",
    keyTrigger: "/",
    textButton: "÷",
  },
  {
    id: "multiply",
    keyTrigger: "*",
    textButton: "×",
  },
  {
    id: "add",
    keyTrigger: "+",
    textButton: "+",
  },
  {
    id: "subtract",
    keyTrigger: "-",
    textButton: "-",
  },
  {
    id: "clear",
    keyTrigger: "Delete",
    textButton: "AC",
  },
];
const calculator = (a = 0, b = 0, operation = "+") => {
  let result = 0;
  a = parseFloat(a);
  b = parseFloat(b);
  switch (operation) {
    case "×":
      result = a * b;
      break;
    case "÷":
      result = a / b;
      break;
    default:
      result = a + b;
      break;
  }
  return `${Math.round(result * 1000000000000) / 1000000000000}`;
};
function App() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("0");

  const handleValues = useCallback(
    (data) => {
      /************** valor signo invalido **************/
      if (/^[+]|^[-]|^[÷]|^[×]/.test(display + data)) {
        setDisplay("0" + data);
        return;
      }
      /************** valor invalido **************/
      if (
        (/[.]/.test(result) && /[.]/.test(data)) ||
        (data === "0" && display === "") ||
        (/[=]/.test(display) && /[=]/.test(data))
      ) {
        console.log("invalid");
        return;
      }
      /************** Set Result value **************/
      console.log("display + data =>", display + data);
      let stringResult = /[=]/.test(display + data) ? data : display + data;
      let newResult =
        stringResult.match(
          /(^\d*[.]?\d+|(?<=[-+÷×=])[-]?\d*[.]?\d+|[-+÷×])$/
        ) || [];
      if (newResult.length > 0) console.log("newResult", newResult[0]);
      if (newResult.length > 0) setResult(newResult[0]);
      /************** Erase All **************/
      if (data === "AC") {
        setDisplay("");
        setResult("0");
        return;
      }
      /************** valor signo invalido **************/
      /* if (/^[+]|^[-]|^[÷]|^[×]/.test(display + data)) {
          setDisplay("0" + data);
          return;
        } */
      /************** guardar valor para hacer continuar calculando **************/
      if (/[=]/.test(display) && /[-+÷×]/.test(data)) {
        /* console.log("guardar valor para hacer continuar calculando"); */
        setDisplay(result + data);
        return;
      }
      /************** reset valor para hacer nuevo calculo **************/
      if (/[=]/.test(display) && !/[-+÷×]/.test(data)) {
        /* console.log("reset valor para hacer nuevo calculo"); */
        setDisplay(data);
        return;
      }
      /************** reemplazo de signo **************/
      if (
        /\d[-+÷×][+÷×]$|\d[+][-]$|\d[-]{2}$|[×÷][-][-]$|[.]{2}$|[-+÷×][=]$/.test(
          display + data
        )
      ) {
        /* console.log("reemplazo de signo ultimo"); */
        setDisplay(display.slice(0, -1) + data);
        return;
      }
      if (/\d[×][-][×÷+]$|\d[÷][-][×÷+]$/.test(display + data)) {
        /* console.log("reemplazo de signo segundo"); */
        setDisplay(display.slice(0, -2) + data);
        return;
      }
      /* console.log("todo ok"); */
      setDisplay(display + data);
    },
    [display, result]
  );

  const handleClick = (e) => {
    /************** get keypress value **************/
    let data = "",
      index = 0;
    index = buttons.findIndex((el) => el.id === e.target.id);
    data = buttons[index].textButton;
    /* console.log("data =>", data); */
    handleValues(data);
  };

  useEffect(() => {
    const handleKeydown = (e) => {
      let data = "",
        index = 0;
      index = buttons.findIndex((el) => el.keyTrigger === e.key);
      console.log(index);
      if (index > 0) {
        data = buttons[index].textButton;
        /* console.log("data =>", data);
        console.log(e.key); */
        handleValues(data);
      }
    };
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleValues]);

  useEffect(() => {
    let values = display.match(/[+]|[÷]|[×]|[-]?\d*[.]?\d+|[-]/gi);
    /* console.log(/[=]$/.test(display), values !== null, values.length >= 2); */
    if (/[=]$/.test(display) && values !== null && values.length >= 1) {
      console.log("operando ...");
      let reduceValue = 0;

      let idx = values.findIndex((el) => /[×÷]/.test(el));
      while (idx > 0) {
        let newValue = calculator(
          values[idx - 1],
          values[idx + 1],
          values[idx]
        );

        values = [
          ...values.slice(0, idx - 1),
          newValue,
          ...values.slice(idx + 2),
        ];
        idx = values.findIndex((el) => /[×÷]/.test(el));
      }
      reduceValue = values.reduce((acc, curr) => {
        if (!isNaN(curr)) {
          return calculator(acc, curr);
        }
        return acc;
      }, 0);
      /* Actualizar el display y el result */
      /* setDisplay(display + reduceValue); */
      setResult(reduceValue);
    }
    return () => {};
  }, [display]);

  return (
    <div className="calculator">
      <div className="calculator__container">
        <div className="calculator__display">
          <div className="calculator__formula">
            <span>{display}</span>
          </div>
          <div className="calculator__result">
            <span id="display">{result}</span>
          </div>
        </div>
        <div className="calculator__controls">
          {buttons.map((el) => (
            <button
              key={el.id}
              className="calculator__button"
              id={el.id}
              onClick={handleClick}
            >
              {el.textButton}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
