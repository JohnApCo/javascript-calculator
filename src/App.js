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
  return `${Math.round(result * 1000000000000) / 1000000000000}`;
};

const Button = ({ id, buttonText, keyTrigger, keyPressHandler, ...props }) => {
  const [isActive, setIsActive] = useState(false);
  const buttonEl = useRef(null);
  /* console.log(buttonEl.current); */

  const clickHandler = useCallback(
    (e) => {
      /************** get keypress value **************/
      let keyPress = "",
        index = 0;
      index = buttons.findIndex((el) => el.id === e.target.id);
      keyPress = buttons[index].textButton;
      /* console.log("currentKey =>", currentKey); */
      console.log("mouse => ", buttonEl.current);
      keyPressHandler(keyPress);
    },
    [keyPressHandler]
  );

  useEffect(() => {
    const handleKeydown = (e) => {
      /*       console.log(
        "e.key === keyTrigger =>",
        e.key === keyTrigger,
        e.key,
        keyTrigger
      ); */
      if (e.key === keyTrigger) {
        /* console.log("keyboard => ", buttonEl.current); */
        let keyPress = "",
          index = 0;
        index = buttons.findIndex((el) => el.keyTrigger === e.key);
        /* console.log("index => ", index); */
        if (index >= 0) {
          keyPress = buttons[index].textButton;
          /* console.log("keyPress => ", keyPress); */
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
    console.log("currentKey", currentKey.key);
    /************** valor invalido **************/
    if (
      !currentKey.newInput ||
      (/[.]/.test(result) && /[.]/.test(currentKey.key)) ||
      (currentKey.key === "0" && display === "") ||
      (/[=]/.test(display) && /[=]/.test(currentKey.key))
    ) {
      console.log("invalid");
      return;
    }
    /************** try init with sign **************/
    if (/^[+]|^[-]|^[÷]|^[×]/.test(display + currentKey.key)) {
      setDisplay("0" + currentKey.key);
      return;
    }
    /************** Set Result value **************/
    console.log("display + currentKey =>", display + currentKey.key);
    let stringResult = /[=]/.test(display + currentKey.key)
      ? currentKey.key
      : display + currentKey.key;
    let newResult =
      stringResult.match(/(^\d*[.]?\d+|(?<=[-+÷×=])[-]?\d*[.]?\d+|[-+÷×])$/) ||
      [];
    if (newResult.length > 0) console.log("newResult", newResult[0]);
    if (newResult.length > 0) setResult(newResult[0]);
    /************** Erase All **************/
    if (currentKey.key === "AC") {
      setDisplay("");
      setResult("0");
      return;
    }
    /************** valor signo invalido **************/
    /* if (/^[+]|^[-]|^[÷]|^[×]/.test(display + currentKey)) {
          setDisplay("0" + currentKey);
          return;
        } */
    /************** guardar valor para hacer continuar calculando **************/
    if (/[=]/.test(display) && /[-+÷×]/.test(currentKey.key)) {
      /* console.log("guardar valor para hacer continuar calculando"); */
      setDisplay(result + currentKey.key);
      return;
    }
    /************** reset valor para hacer nuevo calculo **************/
    if (/[=]/.test(display) && !/[-+÷×]/.test(currentKey.key)) {
      /* console.log("reset valor para hacer nuevo calculo"); */
      setDisplay(currentKey.key);
      return;
    }
    /************** reemplazo de signo **************/
    if (
      /\d[-+÷×][+÷×]$|\d[+][-]$|\d[-]{2}$|[×÷][-][-]$|[.]{2}$|[-+÷×][=]$/.test(
        display + currentKey.key
      )
    ) {
      /* console.log("reemplazo de signo ultimo"); */
      setDisplay(display.slice(0, -1) + currentKey.key);
      return;
    }
    if (/\d[×][-][×÷+]$|\d[÷][-][×÷+]$/.test(display + currentKey.key)) {
      /* console.log("reemplazo de signo segundo"); */
      setDisplay(display.slice(0, -2) + currentKey.key);
      return;
    }
    /* console.log("todo ok"); */
    setDisplay(display + currentKey.key);
    setCurrentKey({ ...currentKey, newInput: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey]);

  const keyPressHandler = (keyPress) => {
    setCurrentKey({ newInput: true, key: keyPress });
  };

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
      setDisplay(display + reduceValue);
      setResult(reduceValue);
    }
    return () => {};
  }, [display]);
  /*   const displayHandler = (newDisplay) => {
    setDisplay(newDisplay);
  };
  const resultHandler = (newResult) => {
    setDisplay(newResult);
  }; */
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
    </div>
  );
}

export default App;
