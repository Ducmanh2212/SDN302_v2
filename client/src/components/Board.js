import React, { useState, useEffect } from "react";
import List from "./List";
import { DragDropContext } from "react-beautiful-dnd";
import { Button, Form, Container, Row, Col, InputGroup } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import "./styles/Board.css";

const Board = () => {
  const getInitialLists = () => {
    const storedLists = localStorage.getItem("boardLists");
    return storedLists
      ? JSON.parse(storedLists)
      : [
          {
            id: "1",
            title: "To Do",
            cards: [{ id: "1", title: "Task 1", description: "", members: [] }],
          },
          {
            id: "2",
            title: "In Progress",
            cards: [{ id: "2", title: "Task 2", description: "", members: [] }],
          },
        ];
  };

  const [lists, setLists] = useState(getInitialLists());
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newMemberName, setNewMemberName] = useState(""); // New state for member name
  const [showMemberInput, setShowMemberInput] = useState(false); // State to manage input visibility

  useEffect(() => {
    localStorage.setItem("boardLists", JSON.stringify(lists));
  }, [lists]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceList = lists.find((list) => list.id === source.droppableId);
    const destinationList = lists.find(
      (list) => list.id === destination.droppableId
    );
    const sourceCards = [...sourceList.cards];
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (sourceList === destinationList) {
      sourceCards.splice(destination.index, 0, movedCard);
      setLists((prev) =>
        prev.map((list) =>
          list.id === sourceList.id ? { ...list, cards: sourceCards } : list
        )
      );
    } else {
      const destinationCards = [...destinationList.cards];
      destinationCards.splice(destination.index, 0, movedCard);
      setLists((prev) =>
        prev.map((list) =>
          list.id === sourceList.id
            ? { ...list, cards: sourceCards }
            : list.id === destinationList.id
            ? { ...list, cards: destinationCards }
            : list
        )
      );
    }
    toast.success("Card moved successfully!");
  };

  const addNewList = () => {
    if (newListTitle.trim() === "") return;
    setLists([
      ...lists,
      { id: (lists.length + 1).toString(), title: newListTitle, cards: [] },
    ]);
    setNewListTitle("");
    setIsAddingList(false);
    toast.success("New list added!"); // Show success toast when a new list is added
  };

  const addMember = () => {
    if (newMemberName.trim() === "") return;
    setLists(
      lists.map((list) => ({
        ...list,
        cards: list.cards.map((card) => ({
          ...card,
          members: [...card.members, newMemberName],
        })),
      }))
    );
    setNewMemberName("");
    setShowMemberInput(false); // Hide the input after adding the member
    toast.success("New member added!"); // Show success toast when a new member is added
  };

  return (
    <Container className="mt-4 board-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <Row>
          {lists.map((list) => (
            <Col key={list.id} md={3}>
              <List list={list} setLists={setLists} lists={lists} />
            </Col>
          ))}
          <Col md={3}>
            <div className="add-list-section">
              {isAddingList ? (
                <div className="new-list">
                  <Form.Control
                    type="text"
                    placeholder="Enter list title..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    className="mb-2"
                  />
                  <Button
                    variant="outline-success"
                    onClick={addNewList}
                    className="mr-2"
                  >
                    Add List
                  </Button>
                  <Button
                    variant="outline-danger mt-2"
                    onClick={() => setIsAddingList(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline-light mt-3 mr-2"
                  onClick={() => setIsAddingList(true)}
                >
                  + Add another list
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </DragDropContext>

      {/* Add Member Section in Top Right */}
      <div className="add-member-btn">
        {!showMemberInput ? (
          <Button
            variant="outline-light mt-3"
            onClick={() => setShowMemberInput(true)}
          >
            Add Member
          </Button>
        ) : (
          <InputGroup className="member-input-group">
            <Form.Control
              type="text"
              placeholder="Enter member name..."
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
            <Button variant="outline-success" onClick={addMember}>
              Confirm
            </Button>
            <Button
              variant="outline-danger ml-2"
              onClick={() => setShowMemberInput(false)}
            >
              Cancel
            </Button>
          </InputGroup>
        )}
      </div>

      <ToastContainer // Toast container to display toasts
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default Board;
