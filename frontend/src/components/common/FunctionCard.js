import { Card, Container } from "react-bootstrap";

import { DynamicForm } from "./RenderCustomView";

const FunctionCard = ({
  title,
  inputs,
  stateMutability,
  setModalContent,
  contractType = "token",
}) => {
  return (
    <Card className="custom-card-2">
      <Card.Title>
        <div className="title">
          {title}
          <div className="title--bottom"></div>
        </div>
      </Card.Title>
      <Card.Body>
        <DynamicForm
          data={inputs}
          method={title}
          contractType={contractType}
          stateMutability={stateMutability}
          setModalContent={setModalContent}
        />
      </Card.Body>
    </Card>
  );
};

export default FunctionCard;
