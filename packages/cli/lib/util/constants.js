export const versionRegEx = /^v[0-9]+\.[0-9]+\.[0-9]+/

// Uses positive-lookbehind to only match versions preceded by 'Terraform ' but without extracting 'Terraform '
export const tfCurrVersionRegEx = /(?<=Terraform )v[0-9]+.{1}[0-9]+.{1}[0-9]+/gm
export const openTofuCurrVersionRegEx = /(?<=OpenTofu )v[0-9]+.{1}[0-9]+.{1}[0-9]+/gm
export const LOWEST_OTF_VERSION = '1.6.0'
