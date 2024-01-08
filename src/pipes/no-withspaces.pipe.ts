import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class NoWithspacesPipe implements PipeTransform<string, string> {
  readonly fields

  constructor({ fields }: { fields: Array<string> }) {
    this.fields = fields
  }

  transform(value: string): string {
    for (const field of this.fields) {
      if (value[field] != undefined && value[field].trim() === '') {
        throw new BadRequestException(
          `El campo ${field} no debe tener solo espacios`,
        )
      }
    }

    return value
  }
}
