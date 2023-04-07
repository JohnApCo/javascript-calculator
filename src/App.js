import { useCallback, useEffect, useRef, useState } from "react";
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
  return `${Math.round(result * 1000000000) / 1000000000}`;
};

const Button = ({ id, buttonText, keyTrigger, keyPressHandler, ...props }) => {
  const [isActive, setIsActive] = useState(false);
  const buttonEl = useRef(null);

  const clickHandler = useCallback(
    (e) => {
      /************** get keypress value **************/
      let keyPress = "",
        index = 0;
      index = buttons.findIndex((el) => el.id === e.target.id);
      keyPress = buttons[index].textButton;
      keyPressHandler(keyPress);
    },
    [keyPressHandler]
  );

  useEffect(() => {
    const handleKeydown = (e) => {
      e.preventDefault();
      e.target.blur();
      if (e.key === keyTrigger) {
        let keyPress = "",
          index = 0;
        index = buttons.findIndex((el) => el.keyTrigger === e.key);
        if (index >= 0) {
          keyPress = buttons[index].textButton;
          keyPressHandler(keyPress);
          setIsActive(true);
          setTimeout(() => {
            setIsActive(false);
          }, 100);
        }
      }
    };
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [keyPressHandler, clickHandler, keyTrigger]);

  return (
    <button
      ref={buttonEl}
      className={`calculator__button ${
        isActive ? "calculator__button-active" : ""
      }`}
      id={id}
      onClick={clickHandler}
      tabIndex="-1"
    >
      {buttonText}
    </button>
  );
};
function App() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("0");
  const [currentKey, setCurrentKey] = useState({ key: "", newInput: false });

  useEffect(() => {
    /************** Erase All **************/
    if (currentKey.key === "AC") {
      setDisplay("");
      setResult("0");
      return;
    }
    /************** valor invalido **************/
    if (
      !currentKey.newInput ||
      (currentKey.key === "0" && display === "") ||
      (/[=]/.test(display) && /[=]/.test(currentKey.key)) ||
      (result.split("").length >= 12 && !/[-+÷×=]/.test(currentKey.key))
    ) {
      return;
    }
    /************** guardar valor para hacer continuar calculando **************/
    if (/[=]/.test(display) && /[-+÷×]/.test(currentKey.key)) {
      setDisplay(result + currentKey.key);
      setResult(currentKey.key);
      return;
    }
    /************** reset valor para hacer nuevo calculo **************/
    if (/[=]/.test(display) && !/[-+÷×]/.test(currentKey.key)) {
      setDisplay(currentKey.key);
      setResult(currentKey.key);
      return;
    }

    if (/[.]/.test(result) && /[.]/.test(currentKey.key)) return;
    /************** reemplazo de signo **************/
    if (
      /\d[-+÷×][+÷×]$|\d[+][-]$|\d[-]{2}$|[×÷][-][-]$|[.]{2}$|[-+÷×][=]$/.test(
        display + currentKey.key
      )
    ) {
      setDisplay(display.slice(0, -1) + currentKey.key);
      return;
    }
    if (/\d[×][-][×÷+]$|\d[÷][-][×÷+]$/.test(display + currentKey.key)) {
      setDisplay(display.slice(0, -2) + currentKey.key);
      return;
    }
    /************** try init with sign **************/
    if (
      /^[+]|^[-]|^[÷]|^[×]/.test(display + currentKey.key) &&
      !/\d[-+÷×]+\d?/.test(display + currentKey.key)
    ) {
      setDisplay("0" + currentKey.key);
      return;
    }
    /************** Set Result value **************/

    let stringResult = /[=]/.test(display + currentKey.key)
      ? currentKey.key
      : display + currentKey.key;
    let newResult =
      stringResult.match(/(^\d*[.]?\d+|(?<=[-+÷×=])[-]?\d*[.]?\d+|[-+÷×])$/) ||
      [];
    if (newResult.length > 0) setResult(newResult[0]);
    /************** valor signo invalido **************/
    setDisplay(display + currentKey.key);
    setCurrentKey({ ...currentKey, newInput: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey]);

  const keyPressHandler = (keyPress) => {
    setCurrentKey({ newInput: true, key: keyPress });
  };

  useEffect(() => {
    let values = display.match(/[÷]|[×]|[-]?\d*[.]?\d+([e][+]\d+)?|[-]|[+]/gi);
    if (/[=]$/.test(display) && values !== null && values.length >= 1) {
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

      if (
        (reduceValue.split("").length > 12 &&
          /[e][+]|\d{2,}[.]\d+/.test(reduceValue)) ||
        /\d{13,}/.test(reduceValue)
      )
        reduceValue = String(Number(reduceValue).toExponential(5));
      if (
        reduceValue.split("").length >= 13 &&
        5 - (13 - reduceValue.split("").length) >= 1 &&
        /[e][+]|\d{2,}[.]\d+/.test(reduceValue)
      )
        reduceValue = String(
          Number(reduceValue).toExponential(
            5 - (13 - reduceValue.split("").length)
          )
        );
      setResult(reduceValue);
    }
    return () => {};
  }, [display]);

  return (
    <div className="calculator">
      <h1 className="calculator__title">Javascript Calculator</h1>
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
            <Button
              key={el.id}
              id={el.id}
              buttonText={el.textButton}
              keyPressHandler={keyPressHandler}
              keyTrigger={el.keyTrigger}
            />
          ))}
        </div>
      </div>
      <a
        href="https://github.com/JohnApCo"
        target="_blank"
        rel="noopener noreferrer"
        className="calculator__author"
      >
        by JohnApCo
      </a>
    </div>
  );
}

export default App;
