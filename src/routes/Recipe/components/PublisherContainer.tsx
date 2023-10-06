interface PublisherProps {
    // ? is used to denote an optional prop
    outline?: "bold",
    size?: "x-small" | "small" | "medium" | "large" | "",
    publisherName: string,
    publisherImageUrl: string,
    color?: string | "",

}

export function PublisherContainer(props: PublisherProps) {
    const imageBorderStyle = () => {
        switch (props.outline) {
            case "bold":
                return "2px solid black"
            default:
                return "initial";
        }
    }
    const imageSize = () => {
        switch (props.size) {
            case "x-small":
                return "25px";
            case "small":
                return "30px";
            case "medium":
                return "40px";
            case "large":
                return "60px";
            default:
                return "35px"
        }
    }
    const fontSize = () => {
        switch (props.size) {
            case "x-small":
                return "x-small";
            case "small":
                return "small"
            case "medium":
                return "medium";
            default:
                return "medium";
        }
    }

    return (
        <div className={"publisher--container"} style={{fontSize:props.size}}>
            <img src={props.publisherImageUrl} alt="Wex" className={"publisher--icon"}
                style={{border: imageBorderStyle(), width: imageSize()}}/>
            <span className={"publisher--name"}
                  style={{
                      color: props.color,
                      fontSize: fontSize(),
            }}>
                {props.publisherName}
            </span>
        </div>
    )
}