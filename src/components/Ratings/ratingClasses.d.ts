export interface ratingProps {
    /** The value the component should display */
    value?: number
    /** Whether the component should be read only or not*/
    readOnly?: boolean
    /**
     * The function to run when the component is clicked on
     * @param newValue The value of the icon the user clicked on
     */
    handleChange?: (newValue: number) => void
}
