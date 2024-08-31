import { Link } from "react-router-dom";
import { useEffect, useState, useId } from 'react';
import Api from './Api';

function SelectOption({choice}) {
    return (
        <option value={choice.value}>
            {choice.display_name}
        </option>
    );
}

function Select({id, name, choices}) {
    const options = choices.map(c => <SelectOption key={c.value} choice={c}/>);
    return (
        <select id={id} name={name}>
            { options }
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
                const response = await Api("/api/query/", request);
                const options = await response.json();
                const fields = options.actions.POST;
                setAiModelChoices(fields.ai_model_name.choices);
                setAudienceChoices(fields.audience.choices);
            };
            get().catch(console.error);
        }, []);

    const onSubmit = async (event) => {
        // Prevent normal form submission request and reload.
        event.preventDefault();

        const headers = new Headers();
        headers.append("X-CSRFToken", Cookies.get("csrftoken"));
        const formData = new FormData(event.currentTarget);
        const request = {
            method: "POST",
            body: formData,
            headers: headers,
            
        };
        const response = await fetch("/api/query/", request);
        console.log(response);
        console.log(await response.json());
    };
    
    const id = useId();
    return (
        <form onSubmit={onSubmit}>
            <label htmlFor={"audience-" + id}>
                Explain Like I'm A:
            </label>
            <Select name="audience" id={"audience-" + id} choices={audienceChoices}/>
            
            <label htmlFor={"ai-" + id}>
                AI Model:
            </label>
            <Select name="ai_model_name" id={"ai-" + id} choices={aiModelChoices}/>

            <div className="query">
                <input name="query" type="text" autoComplete="off"/>
                <button type="submit" className="material-icons contrast">send</button>
            </div>
        </form>
    );
}

export {QueryPage};
