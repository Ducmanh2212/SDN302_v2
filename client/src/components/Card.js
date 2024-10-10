import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  Modal,
  Button,
  Form,
  Dropdown,
  DropdownButton,
  ListGroup,
  Col,
  Row,
} from "react-bootstrap";
import { BsFillCircleFill } from "react-icons/bs";
import "./styles/Card.css";

const Card = ({ card, index, list, setLists, lists }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [cardTitle, setCardTitle] = useState(card.title);
  const [cardDescription, setCardDescription] = useState(card.description);
  const [priority, setPriority] = useState(card.priority || "Medium");
  const [selectedLabel, setSelectedLabel] = useState(""); // For label selection
  const [members, setMembers] = useState(card.members || []); // Manage members
  const [checklist, setChecklist] = useState(card.checklist || []); // Initialize checklist from card data
  const [newChecklistItem, setNewChecklistItem] = useState(""); // State for new checklist input
  const [selectedRole, setSelectedRole] = useState("viewer"); // State for role selection

  const handleSave = () => {
    const updatedCard = {
      ...card,
      title: cardTitle,
      description: cardDescription,
      priority: priority,
      checklist: checklist, // Save checklist
      role: selectedRole, // Save selected role
    };
    const updatedList = {
      ...list,
      cards: list.cards.map((c) => (c.id === card.id ? updatedCard : c)),
    };

    setLists(lists.map((l) => (l.id === list.id ? updatedList : l)));
    setShowModal(false); // Close modal after saving
  };

  const cardStyle = {
    backgroundColor:
      priority === "High"
        ? "#ffcccc"
        : priority === "Medium"
        ? "#ffe5cc"
        : "#ccffcc",
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem) {
      setChecklist([
        ...checklist,
        { text: newChecklistItem, completed: false },
      ]);
      setNewChecklistItem(""); // Clear input field
    }
  };

  const handleToggleChecklistItem = (index) => {
    const updatedChecklist = checklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist); // Toggle completed status
  };

  const handleRemoveChecklistItem = (index) => {
    const updatedChecklist = checklist.filter((_, i) => i !== index);
    setChecklist(updatedChecklist); // Remove checklist item
  };

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided) => (
          <div
            className="card-item"
            style={cardStyle}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>{card.title}</h3>
              <BsFillCircleFill
                style={{
                  color:
                    priority === "High"
                      ? "red"
                      : priority === "Medium"
                      ? "orange"
                      : "green",
                  marginLeft: "10px",
                }}
              />
            </div>
            <p>{card.description}</p>
            <Button
              variant="outline-secondary"
              onClick={() => setShowModal(true)}
            >
              Edit
            </Button>
          </div>
        )}
      </Draggable>

      {/* Modal Popup */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="cardTitle">
              <Form.Label>Card title</Form.Label>
              <Form.Control
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="Enter card title"
              />
            </Form.Group>

            <Form.Group controlId="cardDescription" className="mt-3">
              <Form.Label>Card description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
                placeholder="Enter description"
              />
            </Form.Group>

            <Form.Group controlId="priority" className="mt-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Select>
            </Form.Group>

            {/* Checklist Section */}
            <Form.Group controlId="checklist" className="mt-3">
              <Form.Label>Checklist</Form.Label>
              <ListGroup>
                {checklist.map((item, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <Form.Check
                      type="checkbox"
                      label={item.text}
                      checked={item.completed}
                      onChange={() => handleToggleChecklistItem(index)}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveChecklistItem(index)}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="mt-2 d-flex">
                <Form.Control
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add a new item"
                />
                <Button
                  variant="primary"
                  className="ms-2"
                  onClick={handleAddChecklistItem}
                >
                  Add
                </Button>
              </div>
            </Form.Group>

            {/* Label Section */}
            <Form.Group controlId="label" className="mt-3">
              <Form.Label>Label</Form.Label>
              <DropdownButton
                id="dropdown-basic-button"
                title={selectedLabel || "No Label"}
              >
                <Dropdown.Item onClick={() => setSelectedLabel("Red")}>
                  <BsFillCircleFill style={{ color: "red" }} /> Red
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedLabel("Green")}>
                  <BsFillCircleFill style={{ color: "green" }} /> Green
                </Dropdown.Item>
                {/* Add more colors as needed */}
              </DropdownButton>
            </Form.Group>

            {/* Move Card Section */}
            <Form.Group controlId="moveCard" className="mt-3">
              <Row>
                <Col>
                  <Form.Label>Move this card</Form.Label>
                  <Form.Select>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label>Position</Form.Label>
                  <Form.Select>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    {/* Add more positions */}
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            {/* Role Section */}
            <Form.Group controlId="role" className="mt-3">
              <Form.Label>Assign Role</Form.Label>
              <Form.Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save All Changes
          </Button>
          <Button variant="danger" className="ms-2">
            Delete Card
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Card;
