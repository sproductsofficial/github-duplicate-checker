import { useState } from 'react';

export default function Home() {
    const [repo1, setRepo1] = useState('');
    const [repo2, setRepo2] = useState('');
    const [differences, setDifferences] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await fetch(`/api/compare?repo1=${repo1}&repo2=${repo2}`);
        const data = await res.json();
        setDifferences(data);
    };

    return (
        <div>
            <h1>GitHub Repository Duplicate Checker</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Repo 1 URL"
                    value={repo1}
                    onChange={(e) => setRepo1(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Repo 2 URL"
                    value={repo2}
                    onChange={(e) => setRepo2(e.target.value)}
                    required
                />
                <button type="submit">Compare</button>
            </form>
            {differences && (
                <div>
                    <h2>Differences:</h2>
                    <pre>{JSON.stringify(differences, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
