
import { nexusProps } from "@laravext/react"
import { ComboBox } from "./ui/combo-box"

export default function BrandPicker({
  value,
  onChange,
  placeholder = "Selecione a marca",
  buttonClassName,
  disabled,
  id,
  name,
}) {
  const { brands } = nexusProps()

  // Map brands into the required format for the Combobox
  const brandItems = brands.map((brand) => ({
    value: `${brand.id}`, // Brand ID as value
    label: brand.name, // Brand name as label
  }))

  return (
    <ComboBox
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      buttonClassName={buttonClassName} // You can apply the trigger class here
      items={brandItems} // Pass brand items to the Combobox
    />
  )
}
