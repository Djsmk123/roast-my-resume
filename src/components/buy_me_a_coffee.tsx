const BuyMeACoffeeWidget = () => {
    const path = "https://www.buymeacoffee.com/widget/page/smkwinner?description=Support%20me%20on%20Buy%20me%20a%20coffee!&color=%235F7FFF";

    return (
        <a href="https://www.buymeacoffee.com/smkwinner" style={{
            width: "50%",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            marginTop: "20px",
        }}>

            <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=smkwinner&button_colour=FF5F5F&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" /></a>

    );
};
export default BuyMeACoffeeWidget;
