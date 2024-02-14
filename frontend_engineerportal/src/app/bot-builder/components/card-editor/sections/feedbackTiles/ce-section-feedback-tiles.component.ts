import { Component, Output, EventEmitter, Input, ViewEncapsulation, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'ce-section-feedback-tiles',
  styleUrls: ['ce-section-feedback-tiles.component.sass'],
  templateUrl: 'ce-section-feedback-tiles.component.html'
})

/**
*
*/
export class CEFeedbackTilesSectionComponent implements OnChanges {
  @Output()
  feedbackTilesUpdate = new EventEmitter();
  @Input()
  tiles: Array<any>;
  defaultTiles = [
    {
      // name: '',
      // image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABJtJREFUWAnFWE1sG0UUnjdeO3W4Q5y0oDYUCZlItWNuTeFEDwg1ItjtDZAqVdwpEihqqypC/N2rHlBFeinrJCSqhMSxkFt3HUtpDqj8CEqdwIUTdetd7/C+dWaZbL3ESd1mpdXMvHnz3rdvZt58syR28WQd+1kvRYdUWw0rQcMwQUI1KEWNdFv90ixVft+pWep1QKY+l/f9YIodT/KYIUHqNglqCKUaoQ0iBqWGhaLD3N5gYIuWJedbR95a68XHtkCyq4sHHrRaF5Wi40TimiS5OF14c/kCUdDNwQWl5MzKwtFABZNKiVNE6ruBTOZcc2zyTjd9LftfINK1z7KxDxjA5SGV/bhReuOeHthLOexcH9yg5kds4wxH79OgVP4iaVxXIPiqi+7cFQ71S4NZ8fo/+cpGkoFe5E+t2UP3mvQtO1stiIOn3VLJi497CMi446Rr9OttnvvnRp4Rg38cqDTjg3bT3n/Hzt79U1R5VefPF8ujSVMb2ebpmCW3ej0S9LlCjq2kU/0qblaags01kR95WlVMeT/riLISYozBvG/ajaYGu+P+g1aN18TYo64J00G3emfNiNV9A5mi3k1RRLBFsTseNwgAgw/4gk8N1EIFycrz1fGc2Pd8Jzvp7v/KzYR2DBJOVN8nJape9ZAO1sX9n6APW2FEkDGRrJLyRKpWPeX5wS3GMI6XQddTrn0SoMynVz2MgS/4hG+0QyC8eE5IUksQxB8gDgJx1UqJQlCqnMZrpdTLgRLX0Kf1e9XT+iiRpTePDCFxgPGRlZsulH8wlXTdD8QEI5/1CpW6lqHOq/xL/ppwqiDvVU/bQImjgouhEIO1Un2VXPuGqfAk6/ANDJIPsxx/3fqTdG76wgkOOiFVwEc3jvO9ephGgNNEeWSvcGi/vHARDURljx4mVGB3konLOm/f3B7BEGB1oJgSHBP0DhzkcYBRvBuS7IY+2XeIAUp8NLtWzX4laUDamS/yNvsr4y68mKQTlw/UF17AkZ92bWTjro9Vmz9GTrWGzjAKDHkpUHSiqzYLvdJUjZQ476m2M+B8M5qkp+UA0Wr7rpT0tjdecbU8XoLXgmRDHgIB2+a5OgmOGVfWbU7tl3hBnWkJ70fp2O+Bcek+XUKGvpbv3yCSZ9vF8qzui5fwBXIN3+iL5o9J0RVu3w3GK9PxQWY7XZsr+Up9yDttglfaTU7/WGNsU40KohLrLltSfuIVpm6a4+J19jfDshH29y76IiA7JUbQb7X8I0oFhxgA46GfMxmrrolO3LHZ7kaMzH4BqoiF2y3sWxQfoQHb8AFfppktW5bD9Dl/2hqz7R3dX0yD29XB5Dl6t+DL1N0CBB3niuV3ONS/gcn3MzKbkeBjReRxtzFBoP4QENw3iurgYd5WfzP6ZcxnfNBO27ABWxztq7jT9HTBMp1gHnk79OfKSeKz+HSYvqJdYwrNenQJF+I1ntuvQSnB5hA5U0/XkbZnVqoTSJDIE325hGvjKMFJO78lBGdgynV+S4BQaS6DfyV8eIa/JdQ6f+ESklUS2zdto75tROID0I5+1DC76xArNsR0Aif5bn/U/AtgpFL1CATo+gAAAABJRU5ErkJggg=='
      name: 'Excellent',
      image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiMyMUI3NzY7fQ0KCS5zdDF7ZmlsbDojMDA3RDMxO30NCjwvc3R5bGU+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAsMEM0LjUsMCwwLDQuNSwwLDEwczQuNSwxMCwxMCwxMHMxMC00LjUsMTAtMTBTMTUuNSwwLDEwLDBMMTAsMHogTTEwLDE4LjciLz4NCgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuOCwxMS4ySDYuMmMtMC4zLDAtMC42LDAuMy0wLjYsMC42YzAsMi4zLDIsNC40LDQuNCw0LjRjMi4zLDAsNC40LTIsNC40LTQuNA0KCQlDMTQuNCwxMS41LDE0LjEsMTEuMiwxMy44LDExLjJMMTMuOCwxMS4yeiBNMTAsMTUiLz4NCgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC42LDcuN0w2LjcsNS44TDUuOCw2LjdsMC44LDAuOEg1djEuMmgzLjFjMC4zLDAsMC41LTAuMiwwLjYtMC40QzguOCw4LjEsOC43LDcuOSw4LjYsNy43TDguNiw3Ljd6IE04LjYsNy43DQoJCSIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMy40LDcuNWwwLjgtMC44bC0wLjktMC45bC0xLjksMS45Yy0wLjIsMC4yLTAuMiwwLjQtMC4xLDAuN2MwLjEsMC4yLDAuMywwLjQsMC42LDAuNEgxNVY3LjVIMTMuNHoNCgkJIE0xMy40LDcuNSIvPg0KPC9nPg0KPC9zdmc+DQo='
    },
    {
      name: 'Very Good',
      image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiMwNUQxNjY7fQ0KCS5zdDF7ZmlsbDojMDU5MTQ0O30NCjwvc3R5bGU+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAsMEM0LjUsMCwwLDQuNSwwLDEwczQuNSwxMCwxMCwxMHMxMC00LjUsMTAtMTBTMTUuNSwwLDEwLDBMMTAsMHogTTEwLDE4LjciLz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuOSw1LjZDNS44LDUuNiw1LDYuNSw1LDcuNWMwLDEsMC44LDEuOSwxLjksMS45czEuOS0wLjgsMS45LTEuOUM4LjcsNi41LDcuOSw1LjYsNi45LDUuNkw2LjksNS42eg0KCQkJIE02LjksOC4xIi8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMy4xLDUuNmMtMSwwLTEuOSwwLjgtMS45LDEuOWMwLDEsMC44LDEuOSwxLjksMS45UzE1LDguNSwxNSw3LjVDMTUsNi41LDE0LjIsNS42LDEzLjEsNS42TDEzLjEsNS42eg0KCQkJIE0xMy4xLDguMSIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTQuNCwxMC42YzAsMi40LTIsNC40LTQuNCw0LjRjLTIuNCwwLTQuNC0yLTQuNC00LjRINC40YzAsMy4xLDIuNSw1LjYsNS42LDUuNmMzLjEsMCw1LjYtMi41LDUuNi01LjZIMTQuNHoNCgkJCSBNMTQuNCwxMC42Ii8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo='
    },
    {
      // name: '',
      // image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABNlJREFUWAnFWE1sW0UQ3nlx7DpBBDhAnFBoG4IEblBj+0gLJyqBoBHBhlMBCVRx4USRQFETqgjxe0ZwKZQL2ElIVFSJGxW59dmJlBqEQvkrdQIHShCtm2f7DfM52efnV7t5SV3lXXZ2d3Zm3uzOzLdLagtf2EzfU2qjPVzhHlbUAxGkuEBtVGiv8M/FROr3zYolvwuC8xPRctkeFsVDsqZbES+SooJiLlRlEIlR3KOY+qW/LIZNBwLGpLXvmbwfHRsaEl6Y3rlqWceZ6SCR+sIgY3pk8OnZMSK7kYIxZmN8buphm+0hZvUcEX8TCgaPFQeGLjTi12PXNcTIpo+KsNfFgI+7Ofx2IfHkFb3QT9tjnupYpuKbIuOIeO9dO5H8oNm6hobgr45nJ06Iq/d2hNUTl6Op5WYC/Ix35tPdV4p0WpQtDKrdL2UTiZJ33TWGxE2zPUe/LMre39t7l+r4Y2eq6F20lf7dF9Lhi3+qjJzq6Ggs2ddsax3Zsh0nKZs55Qy0mCAzzYaZ+cwr1nAPrJ+JaO+dnHKPt5KGl1mpATHmNbdcZ2sQHVdXrZyciYEbPRNuBY3otTOjFnaEgjEdTY5HEKKIjpttBAyDDuiCTm1oAASSVanMByNqx31r2UlP19poPh38oUivYuS2rs5P/u5//N/abI3yy4d0sKSu/gTdSHpVjyBjIlk1yxN3LJ6+9fuiWpVwPszEBy6t/LcChTX1a5RfPnBDF3RCN/pVQ+TwHDKIZzDQ6Ptn5fLLiuhrTqQe4njqKeFZ0N5x8/vl02uQpddLhjJQwKRkRUYGk99phoYt8y5nnNSvDu0l/PLJOpQKabphAwXmMo9WbH5L/vQRr0zdxzZga+AVSXS7ZHzv7V23dHnPiV8+LRctZdNn2gwaNaSYRSSGl9yTXjofTVlQTKy+lZrx6YNhFfIagTV++dzyUcEBJwJsS+kmKecbfOuKPwTb9eq6Xz5HncAIYBonjzgT20TIwYU3xCvb9QmgArozBLgsSfhGtssOoDpATAMYE/AOGORmGMMSDc3kVnWK7qoNYJLSnA3k0k3Dt92cjEmY/RXMTj3QTKh3PDQ/dT9Kfns2HffO6X4gN3mAzEwO/aoXxOQZm+mQZvC2pcRwTkJ3tMQVM2R+1eed9/ZhhFUpZw2Dni/FU1nvvO4D1wJko181BGhb9upZYEzN5G3tROojOVBHLFX60TDTrwBxeXkwhjmrXD5DZBytxJInvTy6D10A19CNMWf/BBSdkP5FO54a0cyN2vbcRKLM/IZE2n7F6qwULpwxkcl9ko8SsmY2YBjvlAaHzzZar8dE37jQvaLvRYw5hmwWGIHfssr7mO09YoDYQ+eDwcC8BjpaYaO2swqm64FRHR+gIg5uI7fXMd5AB7KhA7rcYupCVtz0vvxaXtD2pu4vboEb0UDy4r1z0OXmrTMEE8diyRfE1b8BybfSM+uekLKiorjbuI0AfY0hY3KVjPHufgmrS2L9LPbTu2izfciALPH257jT+LpguZVgHyUcWnPlJPWedzvcupyocQ+6aecSrtRjsrdfAlICzcFzbj5NI22Pz2X2I0EiT7TkEq6Fo609SyjJwBRZe5YAoNJYBm8lUjyrzxK8JH8409JnCbcxmnYeagTdVYGVTABOoJJv9aHmf7k8a5Nj4Du8AAAAAElFTkSuQmCC'
      name: 'Good',
      image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNGNEFFNEE7fQ0KCS5zdDF7ZmlsbDojRDE3NjFDO30NCjwvc3R5bGU+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAsMEM0LjUsMCwwLDQuNSwwLDEwczQuNSwxMCwxMCwxMHMxMC00LjUsMTAtMTBTMTUuNSwwLDEwLDBMMTAsMHogTTEwLDE4LjciLz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuOSw1LjZDNS44LDUuNiw1LDYuNSw1LDcuNWMwLDEsMC44LDEuOSwxLjksMS45czEuOS0wLjgsMS45LTEuOUM4LjcsNi41LDcuOSw1LjYsNi45LDUuNkw2LjksNS42eg0KCQkJIE02LjksOC4xIi8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMy4xLDUuNmMtMSwwLTEuOSwwLjgtMS45LDEuOWMwLDEsMC44LDEuOSwxLjksMS45UzE1LDguNSwxNSw3LjVDMTUsNi41LDE0LjIsNS42LDEzLjEsNS42TDEzLjEsNS42eg0KCQkJIE0xMy4xLDguMSIvPg0KCQk8cmVjdCB4PSI1LjQiIHk9IjEyLjgiIGNsYXNzPSJzdDEiIHdpZHRoPSI5LjIiIGhlaWdodD0iMS4yIi8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo='

    },
    {
      // name: '',
      // image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABOxJREFUWAnNWE1MXFUUvufNDwwY0cYoUNtCWzZOaWBm2oXRqhubaLRE5MVuahcaE01cGDXRNLQljca/xJWJbvBno28YA1ab6EYbmy6aeUCk6IL+1w6YmFYaywAz847nm+E9Xl+H4YFj8G3uueeev3d/zvnuJbWKL5I2NuYCtJkL3MyKmmGCFGcoQJlQgc9lE/qllZolvwrh0YFoPm91i+Mu0WlUxBOkKKOYM0UbRBIUNyumNulPSWCDwaCWmu94etyPj2UDiYwNbpibn+9jpt1E6kuNtMEDnU+dOERklXNwiFk7MvL1AxZbXczqGSL+viYc7s22d10uJ2/zKgaimcZrYux1CeDjRo68lUk8MWMr+mmb00frpij7pth4QWbvHSvR8/5SemUDwV/1mQP9MtXb6iLq8RtRfWopA3749eNG40yWjomzsU7V+pyZSOS8ercEEk+nQ8N0fkLWftP6e1Td7xv0rFdpNf17LxuRK3+opOzq6MFYz5alltaxLcvxOZnJow6jygSlDdbSyc+8ZjU3Y2FPRNffzbqbX00as8xKtUswr7rtOkuD0zE7Nz8se6L93+4Jt4NydGnPqLHamnDMPk3OjOCI4nT810EgMPiAL/i0Aw2CQLLK5Xl3k6rdWspO9vBiGx03wr9l6WVw7mio/+Rq22PXF0cXKb9ySAeTavYMfCPpFWcEGRPJaqk8sW7i2O2/ZtWcHOd9TLzr2vTf03C46L5E+ZWDNHzBJ3yjXwxENs8ejXgIjHLfX9M3nldE33JC385x/UmRGbNnxy3vV87WQZZeKBlKQwGTktV0oLPnZ1ugbMvc4vBJXXBoL+FXTvRQKqRpRAwUHEk+XLD4sPzpQ16bdh/LgKXBrEiiaxH+tjsbbmvw7hO/crZdtGQaxwMaHdSkmDXJGZ50D3rp8ag+D8fE6iepGZ/eF1E13iCg41fObR8VHHAiyJaUbpJyvsy34PgDiFWq637lHHcCI4BpnDziDKwRIRsXsyGzslafACqgO02Ay6Qc36a1igOoDhAzCIxZUNQGDLJsaXZFWzuc2pQjq4OZt4BNRGdDrI3OxrovusQqkvB52BxoQwzFoiel2Qxo6pV8TD9eUVMGQ6PGznxevSGe75fuKZnWs9CRDYeAdsrxPhkMqrdzHfop8Ct9weHUroJlfciJnlix1kg0QxbTHlGqGEhgOLkvX+B++fsXN667a++F1kdmZVmdr+X8j7WXrv75bD7P30iZ7xNo+JEzWIYArgXIdmyg8EhiuQKMWUa+yNLMgZconbxe+0tq81IyNr/GNLZCNmAa+22et4UvkcnAN8aKxxfVT2blBwBdrwL6IdOIy6bqDYd4x+z27nPlZNy8ubh+JhyguMWqPzSS2uEes2n4AsK3rxviv/T9b4ARkJKU5Xdnsuo7AF07wGq3sA0f8GWjM/i4KbNacf09ERgXtL2i+8tKggWSl/pyGr7cejcFgoHeWM9+OZoXgeSrOTOwBQSP6wTuNu4gQN8SCJJajFvb5Fhdk+hP1MvlyKu00j5swJbM9he40/i6YLmdVPXKKXvCuxxuX86pcTPdtHMJV+pRWduvACmB5jBzbjmbRto+MpJ8EAmyapdw2zhaJJ7Ss4SSDExNpWcJACoby+CtRIpn8VmCJ+UPh6r6LOEOxqadhxpBd0VgJQOAE6jkq32o+Qf3U3Zy8+PqfwAAAABJRU5ErkJggg=='
      name: 'Unsatisfied',
      image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNGNDdDNUQ7fQ0KCS5zdDF7ZmlsbDojRDMzRjExO30NCjwvc3R5bGU+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAsMEM0LjUsMCwwLDQuNSwwLDEwczQuNSwxMCwxMCwxMHMxMC00LjUsMTAtMTBTMTUuNSwwLDEwLDBMMTAsMHogTTEwLDE4LjciLz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuOSw1LjZDNS44LDUuNiw1LDYuNSw1LDcuNWMwLDEsMC44LDEuOSwxLjksMS45czEuOS0wLjgsMS45LTEuOUM4LjcsNi41LDcuOSw1LjYsNi45LDUuNkw2LjksNS42eg0KCQkJIE02LjksOC4xIi8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMy4xLDUuNmMtMSwwLTEuOSwwLjgtMS45LDEuOWMwLDEsMC44LDEuOSwxLjksMS45UzE1LDguNSwxNSw3LjVDMTUsNi41LDE0LjIsNS42LDEzLjEsNS42TDEzLjEsNS42eg0KCQkJIE0xMy4xLDguMSIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAsMTBjLTIuOCwwLTUsMi4yLTUsNWgxLjNjMC0yLjEsMS43LTMuOCwzLjgtMy44YzIuMSwwLDMuOCwxLjcsMy44LDMuOEgxNUMxNSwxMi4yLDEyLjgsMTAsMTAsMTBMMTAsMTB6DQoJCQkgTTEwLDEwIi8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo='
    },
    {
      // name: '',
      // image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABL9JREFUWAnFWEtsG1UUffd5/Atih2iSUlAbWSC5VpPpiBUgWEAXCCWktQULKlSQ+EhUCFEWUJVSRYjfgi0SHwELiu2URBUgskHQ7hjbrdJISKmKoOCkG9jQuLFn5nHPJGMm07FrO446kjVvru/nzHvv3nvekOjhSpr5OxsR2qVsNawEDcMFCVWlCFWjtrpUM3J/dOuWOjWInSumLcvZz4En2GZQkFokQVWhVNX1QcSg1LBQlOLnZQY2o2lyuj56YKGTGDcEkpyf2bFar59QivYRiZOS5MzRscmzx4mcsADHlZJTlVP3OcqZUEo8QaR+iMdix2qZicth+p6sLRBZyh9hZ68xgI8GVfLtqvHYimfYyX3YPD2wTLXX2cdzPHvvOkb2g1Z2oUDwVidKxc94qncPJMWjV9O55VYOOpHfspAfXKnRdxxsfkzsfLZkGI2g3XVA9ppmtEy/LfLa37V9mxj4c0euFjTq5fmOy/nkX1dEgXd1+k09O9JqaZu+eTm+oFLhdFPQ5wGZeSXNwudBt9IvWN8T6e23q5xf3s8xZlkJkWEwr/r9NpcG2XFttV7mPZHZ7J7wBwgbr+0ZMZ+Ix3Qvm5ozghRFdmw1CABDDMRCTA+oCwTFCnUCKer9sdV3xEJMxEYsFwgqJopVt3ViM2ARCzERuwmEN8+4JDW7Gce92KJKr7cMIdDAyCxUUcTCnMly8XlZKnwS/E+a+Y/594In71TP08cdMREbGCS6KBpYqwKjSXGGS/TBaCU/6jnBmGfxGW5qP3uyTvU8fdzdmBwbGDTeMEPcKZfYceiF7hkpF56ybFHhmfkUSjw+KKV40t9ZO9ULBkEHB52QyuHWjXbe5rL17MmoJncLol/wi2o0ClnQpFO9DXZMI8BptA3CNg/rb+9yi3of9IIueONiNjArN+liQgV2J5m4YH8M3SQYAqwOFFMDx7QFpZBKrTInDGTc/GbEEnaGHY1wWayToy4l4nHzamb8Sph+mAwx3yoVU8DgNj1uzaWIFK9Yeu6nMAO/TKsUHrRtdYQ3+BinvUlKLPIGTjCgXfx69xLR95oWeae+Z/KC3y5srJWnH7Ad50NlZHV3szKaWUfROCu3BcLp+7LtqClez5fuSajHF9K5uj/tb/t19ta//1091GhYP0bKxcO2fuCrMACeDLwWJBs+3BlB42nYztyQSqZa9RvmKm9wmh1OKjm6Yuxf8pyF3aPlU3ssxzoXEbTPMrJzYTrgs0vi2kUuBQ8jI92yjgEjmgPRDTPSzOmHGPWLiVjUuBEI2Df0yfMaCcMWzODP5+8O84lYYPjrZWFtRqC4VcRIcenmy7+Coi0xAlPitvzeSk18C6Ib9ha9yIIg4BsxEMtjZ/C7oeM6e3Pvs8ICs+2uzi/dAAST5/5yAbH8dhuA4I9jevZpTsffweT7OTPwBQaP4wTONn4QGF8HBEVNVztTnFb/MPqzWM+gUbfP8AFfPNtf4kzT0QHLH6SvR07eE8Hl8Mdy64hfEBw3D+FCPMJr+zUo5dGx7JlW7QBle6pSuB8FkglVfw7hflD/f5YQXIFpaO2zhODC5nEZfCvh5ul+llBL/Iazff0s4QfjjZsfapjdrRErhsN0Ap281w81/wGLams1i5RMFwAAAABJRU5ErkJggg=='
      name: 'Veryunsatisfied',
      image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNGNzU4NTQ7fQ0KCS5zdDF7ZmlsbDojRDgwOTAwO30NCjwvc3R5bGU+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAsMEM0LjUsMCwwLDQuNSwwLDEwczQuNSwxMCwxMCwxMHMxMC00LjUsMTAtMTBTMTUuNSwwLDEwLDBMMTAsMHogTTEwLDE4LjciLz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE1LDE1YzAtMi44LTIuMi01LTUtNWwwLDBjLTIuOCwwLTUsMi4yLTUsNSBNMTAsMTAiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LjksNS40TDE0LDQuNWwtMC45LDAuOWwtMC45LTAuOWwtMC45LDAuOWwwLjksMC45bC0wLjksMC45TDEyLjIsOGwwLjktMC45TDE0LDhsMC45LTAuOUwxNCw2LjJMMTQuOSw1LjR6DQoJCQkgTTE0LjksNS40Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LjYsNS40TDcuOCw0LjVMNi45LDUuNEw2LDQuNUw1LjEsNS40TDYsNi4yTDUuMSw3LjFMNiw4bDAuOS0wLjlMNy44LDhsMC45LTAuOUw3LjgsNi4yTDguNiw1LjR6IE04LjYsNS40Ig0KCQkJLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg=='
    }
  ];
  // placeholders = ['Extremely Positive', 'Positive', 'Negative', 'Extremely Negative'];
  placeholders = ['Excellent', 'Very Good', 'Good', 'Unsatisfied', 'Veryunsatisfied'];

  constructor(private sanitizer: DomSanitizer) { }
  botIconErrorHandler() { }

  sanitizeUrl(imageUrl) {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl)
  }

  ngOnChanges() {
    if (this.tiles.length === 0) {
      this.tiles = this.defaultTiles;
    }
  }

  tileChange(index, value) {
    let tile = this.tiles[index];
    this.feedbackTilesUpdate.emit({ index, tile });
  }

  addTiles(condition) {
    if (condition) {
      this.tiles.push({ 'name': "", 'image': '' })
    }
    else {
      this.tiles.pop()
    }
  }

}
