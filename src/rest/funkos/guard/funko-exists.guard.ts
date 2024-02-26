import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { FunkosService } from '../funkos.service'
import { Observable } from 'rxjs'

@Injectable()
export class FunkoExistsGuard implements CanActivate {
  constructor(private readonly funkoService: FunkosService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const productId = parseInt(request.params.id, 10)

    // Lógica para verificar si el ID del producto es válido
    if (isNaN(productId)) {
      throw new BadRequestException('El id del producto no es válido')
    }
    return this.funkoService.findById(productId).then((funko) => {
      if (!funko) {
        throw new BadRequestException('El ID del producto no existe')
      }
      return true
    })
  }
}
