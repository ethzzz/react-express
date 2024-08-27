export default function TodoList(props:any) {
    console.log(props.items)
    return (
        <div>
            <ul>
                {props.items.map((item:any) => (
                    <li key={item.id}>{item.text}</li>
                ))}
            </ul>
            <button onClick={() => props.setItems([...props.items, { id: Date.now(), text: 'new item' }])}>addItem</button>
            <button onClick={() => props.setItems([])}>clearItems</button>
        </div>
    )
    
}