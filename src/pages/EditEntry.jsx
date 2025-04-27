import { useParams } from "react-router-dom";

function EditEntry() {
  const { id } = useParams();
  
  return (
    <div className="text-center mt-10">
      <h2 className="text-xl font-bold">Edit Entry ID: {id} (Coming soon)</h2>
    </div>
  );
}

export default EditEntry;
