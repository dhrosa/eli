import { Link } from "react-router-dom";
import { useEffect, useState, useId } from 'react';

function SelectOption(choice) {
    return (
        <option value={choice.value}>
            {choice.display_name}
        </option>
    );
}

function Select({id, name, choices}) {
    return (
        <select id={id} name={name}>
            { choices.map(SelectOption) }
        </select>
    );
}

function QueryPage({data}) {
    const [aiModelChoices, setAiModelChoices] = useState([]);
    const [audienceChoices, setAudienceChoices] = useState([]);
    
    useEffect(
        () => {
            const get = async() => {
                const request = {
                    method: "OPTIONS",
                };
                const response = await fetch("/api/query/", request);
                const options = await response.json();
                const fields = options.actions.POST;
                setAiModelChoices(fields.ai_model_name.choices);
                setAudienceChoices(fields.audience.choices);
            };
            get().catch(console.error);
        }, []);

    const action = (event) => {
        console.log(event);
    };
    
    const onSubmit = (event) => {
        event.preventDefault();
        console.log(event);
        const formData = new FormData(event.currentTarget);        
        console.log(formData);
    };
    
    const id = useId();
    return (
        <form action={action} onSubmit={onSubmit}>
            <label for={"audience-" + id}>
                Explain Like I'm A:
            </label>
            <Select name="audience" id={"audience-" + id} choices={audienceChoices}/>
            
            <label for={"ai-" + id}>
                AI Model:
            </label>
            <Select name="ai_model_name" id={"ai-" + id} choices={aiModelChoices}/>

            <div class="query">
                <input name="query" type="text" autocomplete="off"/>
                <button type="submit" className="material-icons contrast">send</button>
            </div>
        </form>
    );
}

export {QueryPage};
