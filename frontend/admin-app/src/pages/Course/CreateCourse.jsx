import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  PlusCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Folder,
  Edit2,
} from "lucide-react";

const initialSections = [
  {
    id: "section-1",
    title: "Section 1: Introduction",
    type: "section",
    lectures: [
      { id: "lecture-1", title: "Lecture 1: Introduction", type: "lecture" },
      { id: "lecture-2", title: "Lecture 2: Course Overview", type: "lecture" },
    ],
  },
];

export default function CreateCourse() {
  const [sections, setSections] = useState(initialSections);
  const [expandedSections, setExpandedSections] = useState(["section-1"]);
  const [editingId, setEditingId] = useState(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same section
      const sectionIndex = sections.findIndex(
        (s) => s.id === source.droppableId
      );
      const newLectures = Array.from(sections[sectionIndex].lectures);
      const [reorderedItem] = newLectures.splice(source.index, 1);
      newLectures.splice(destination.index, 0, reorderedItem);

      const newSections = [...sections];
      newSections[sectionIndex] = {
        ...sections[sectionIndex],
        lectures: newLectures,
      };
      setSections(newSections);
    } else {
      // Moving between sections
      const sourceSectionIndex = sections.findIndex(
        (s) => s.id === source.droppableId
      );
      const destSectionIndex = sections.findIndex(
        (s) => s.id === destination.droppableId
      );

      const newSourceLectures = Array.from(
        sections[sourceSectionIndex].lectures
      );
      const newDestLectures = Array.from(sections[destSectionIndex].lectures);

      const [movedItem] = newSourceLectures.splice(source.index, 1);
      newDestLectures.splice(destination.index, 0, movedItem);

      const newSections = [...sections];
      newSections[sourceSectionIndex] = {
        ...sections[sourceSectionIndex],
        lectures: newSourceLectures,
      };
      newSections[destSectionIndex] = {
        ...sections[destSectionIndex],
        lectures: newDestLectures,
      };
      setSections(newSections);
    }
  };

  const addSection = () => {
    const newSectionNumber = sections.length + 1;
    const newSection = {
      id: `section-${newSectionNumber}`,
      title: `Section ${newSectionNumber}: New Section`,
      type: "section",
      lectures: [],
    };
    setSections([...sections, newSection]);
    setExpandedSections([...expandedSections, newSection.id]);
  };

  const addLecture = (sectionId) => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    const newLectureNumber = sections[sectionIndex].lectures.length + 1;
    const newLecture = {
      id: `lecture-${Date.now()}`,
      title: `Lecture ${newLectureNumber}: New Lecture`,
      type: "lecture",
    };
    const newSections = [...sections];
    newSections[sectionIndex].lectures.push(newLecture);
    setSections(newSections);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const startEditing = (id) => {
    setEditingId(id);
  };

  const handleTitleChange = useCallback((id, newTitle) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === id) {
          return { ...section, title: newTitle };
        }
        return {
          ...section,
          lectures: section.lectures.map((lecture) =>
            lecture.id === id ? { ...lecture, title: newTitle } : lecture
          ),
        };
      })
    );
    setEditingId(null);
  }, []);

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Course Content Creator</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        {sections.map((section) => (
          <div key={section.id} className="mb-4 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center flex-grow">
                <Folder className="flex-shrink-0 mr-2" />
                {editingId === section.id ? (
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      handleTitleChange(section.id, e.target.value)
                    }
                    onBlur={() => setEditingId(null)}
                    autoFocus
                    className="flex-grow p-1 border rounded"
                  />
                ) : (
                  <h2 className="flex-grow text-lg font-semibold">
                    {section.title}
                  </h2>
                )}
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => startEditing(section.id)}
                  className="mr-2 text-gray-500 hover:text-gray-700"
                >
                  <Edit2 size={18} />
                </button>
                <button onClick={() => toggleSection(section.id)}>
                  {expandedSections.includes(section.id) ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </button>
              </div>
            </div>
            {expandedSections.includes(section.id) && (
              <Droppable droppableId={section.id}>
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="pb-4 pl-8 pr-4"
                  >
                    {section.lectures.map((lecture, index) => (
                      <Draggable
                        key={lecture.id}
                        draggableId={lecture.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center p-3 mb-2 rounded bg-gray-50"
                          >
                            <FileText className="flex-shrink-0 mr-2" />
                            {editingId === lecture.id ? (
                              <input
                                type="text"
                                value={lecture.title}
                                onChange={(e) =>
                                  handleTitleChange(lecture.id, e.target.value)
                                }
                                onBlur={() => setEditingId(null)}
                                autoFocus
                                className="flex-grow p-1 border rounded"
                              />
                            ) : (
                              <span className="flex-grow">{lecture.title}</span>
                            )}
                            <button
                              onClick={() => startEditing(lecture.id)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <Edit2 size={18} />
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <li>
                      <button
                        onClick={() => addLecture(section.id)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <PlusCircle className="mr-1" size={18} />
                        Add lecture
                      </button>
                    </li>
                  </ul>
                )}
              </Droppable>
            )}
          </div>
        ))}
      </DragDropContext>
      <button
        onClick={addSection}
        className="flex items-center px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        <PlusCircle className="mr-2" />
        Add Section
      </button>
    </div>
  );
}
